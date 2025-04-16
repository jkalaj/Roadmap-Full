from typing import List, Dict, Optional

class RoadmapBlock:
    def __init__(
        self,
        block_id: str,
        title: str,
        category: str,
        average_time: float,
        cost: float,
        subgraph: Optional["RoadmapGraph"] = None
    ):
        self.id = block_id
        self.title = title
        self.category = category
        self.average_time = average_time
        self.cost = cost
        self.prerequisites: List[str] = []
        self.forward_connections: List[str] = []
        self.subgraph = subgraph  # Optional nested graph

    def add_prerequisite(self, prereq_id: str):
        if prereq_id not in self.prerequisites:
            self.prerequisites.append(prereq_id)

    def add_forward_connection(self, next_id: str):
        if next_id not in self.forward_connections:
            self.forward_connections.append(next_id)

    def __repr__(self):
        return f"RoadmapBlock({self.id}, {self.title})"

class RoadmapGraph:
    def __init__(self, start_id: Optional[str] = None, end_id: Optional[str] = None):
        self.blocks: Dict[str, RoadmapBlock] = {}
        self.start_id = start_id
        self.end_id = end_id

    def add_block(self, block: RoadmapBlock):
        self.blocks[block.id] = block

    def connect_blocks(self, from_id: str, to_id: str):
        if from_id in self.blocks and to_id in self.blocks:
            self.blocks[from_id].add_forward_connection(to_id)
            self.blocks[to_id].add_prerequisite(from_id)

    def get_block(self, block_id: str) -> Optional[RoadmapBlock]:
        return self.blocks.get(block_id)

    def find_all_paths(self, start_id: str, end_id: str, depth: Optional[int] = 0) -> List[List[str]]:
        all_paths = []

        def dfs(current_id: str, path: List[str], depth_remaining: Optional[int]):
            if current_id in path:
                return

            block = self.get_block(current_id)
            if block is None:
                return

            # Determine if we should expand subgraph
            should_expand = (
                block.subgraph is not None and
                (depth_remaining is None or depth_remaining > 0)
            )

            if should_expand:
                # Compute new depth: None means unlimited
                new_depth = None if depth_remaining is None or depth_remaining == -1 else depth_remaining - 1

                sub_paths = block.subgraph.find_all_paths(
                    block.subgraph.start_id,
                    block.subgraph.end_id,
                    new_depth
                )
                for sub_path in sub_paths:
                    dfs_through_subgraph = path + [f"{current_id}.{p}" for p in sub_path]
                    if current_id == end_id:
                        all_paths.append(dfs_through_subgraph)
                    else:
                        for neighbor_id in block.forward_connections:
                            dfs(neighbor_id, dfs_through_subgraph, depth_remaining)
            else:
                path.append(current_id)
                if current_id == end_id:
                    all_paths.append(path.copy())
                else:
                    for neighbor_id in block.forward_connections:
                        dfs(neighbor_id, path, depth_remaining)
                path.pop()

        dfs(start_id, [], None if depth == -1 else depth)
        return all_paths

    def __repr__(self):
        return f"RoadmapGraph({list(self.blocks.keys())})"


def cli(graph: RoadmapGraph):
    while True:
        try:
            command = input(">> ").strip()
        except EOFError:
            break

        if command == "quit":
            break

        elif command.startswith("find_all"):
            parts = command.split()
            if len(parts) != 2:
                print("Usage: find_all <depth>")
                continue
            try:
                depth = int(parts[1])
                print(f"Blocks (depth={depth}):")
                for block_id in graph.blocks:
                    block = graph.get_block(block_id)
                    print(f"- {block_id}: {block.title}")
                    if block.subgraph and depth > 0:
                        subpaths = block.subgraph.find_all_paths(
                            block.subgraph.start_id, block.subgraph.end_id, depth - 1
                        )
                        print(f"  [Subgraph Paths]: {len(subpaths)}")
            except ValueError:
                print("Invalid depth.")

        elif command.startswith("get_paths"):
            parts = command.split()
            if len(parts) != 4:
                print("Usage: get_paths <start_id> <end_id> <depth>")
                continue
            start_id, end_id, depth_str = parts[1], parts[2], parts[3]
            try:
                depth = int(depth_str)
                raw_paths = graph.find_all_paths(start_id, end_id, depth)
                results = []

                for path in raw_paths:
                    total_time = 0
                    total_cost = 0
                    for node_id in path:
                        parts = node_id.split(".")
                        block = None
                        current_graph = graph
                        for part in parts:
                            block = current_graph.get_block(part)
                            if block and block.subgraph:
                                current_graph = block.subgraph
                        if block:
                            total_time += block.average_time
                            total_cost += block.cost
                    results.append((path, total_time, total_cost))

                # Sort by total_time
                results.sort(key=lambda x: x[1])

                print(f"Found {len(results)} path(s):")
                for path, total_time, total_cost in results:
                    print(" -> ".join(path))
                    print(f"  Time: {total_time} months, Cost: ${total_cost}")

            except ValueError:
                print("Invalid depth.")

        elif command == "add block":
            block_id = input("ID: ").strip()
            title = input("Title: ").strip()
            category = input("Category: ").strip()
            try:
                average_time = float(input("Average Time (months): "))
                cost = float(input("Cost (USD): "))
            except ValueError:
                print("Invalid number input.")
                continue

            block = RoadmapBlock(block_id, title, category, average_time, cost)
            graph.add_block(block)
            print(f"Added block: {block_id}")

        else:
            print("Unknown command. Try: find_all, get_paths, add block, quit")


graph = RoadmapGraph()
# Resident status
graph.add_block(RoadmapBlock("prospective", "Prospective Immigrant", "Status", 0, 0)) # Starting block
graph.add_block(RoadmapBlock("temp_resident", "Temporary Resident", "Status", 1, 200))
graph.add_block(RoadmapBlock("perm_resident", "Permanent Residency", "Status", 6, 500))
graph.add_block(RoadmapBlock("asylum", "Asylum/Refugee", "Status", 12, 0))
graph.add_block(RoadmapBlock("citizenship", "Citizenship", "Status", 6, 630))

# Temporary Entry Specific
graph.add_block(RoadmapBlock("etravel", "E-Travel Visa", "Entry", 0.5, 50))
graph.add_block(RoadmapBlock("digital_nomad", "Digital Nomad Visa", "Entry", 2, 200))
graph.add_block(RoadmapBlock("visitor", "Visitor", "Entry", 0.5, 100))

# Temporary Resident Requirements (not all)
graph.add_block(RoadmapBlock("study", "Study", "Core", 12, 15000))
graph.add_block(RoadmapBlock("spouse_family", "Spouse/Family", "Core", 6, 1000))
graph.add_block(RoadmapBlock("startup_visa", "Startup Visa", "Core", 6, 4000))
graph.add_block(RoadmapBlock("investor", "Foreign Investor", "Core", 6, 10000))
graph.add_block(RoadmapBlock("lmia", "LMIA", "Core", 3, 1000))
graph.add_block(RoadmapBlock("permit_open", "Work Permit Open", "Core", 2, 155))
graph.add_block(RoadmapBlock("permit_closed", "Work Permit Closed", "Core", 2, 155))

# Permanent Resident Requirements
graph.add_block(RoadmapBlock("express_entry", "Express Entry", "Core", 6, 1325))
graph.add_block(RoadmapBlock("nom_prov", "Nomination Provincial", "Core", 9, 1000))
graph.add_block(RoadmapBlock("nom_atlantic", "Nomination Atlantic", "Core", 9, 1000))
graph.add_block(RoadmapBlock("nom_rural", "Nomination Rural Community", "Core", 9, 1000))


#Employment status
graph.add_block(RoadmapBlock("equitable_employment", "Equitable Employment", "Employment", 3, 0))
graph.add_block(RoadmapBlock("equitable_employment_study", "Equitable Employment with Study", "Employment", 3, 0))
graph.add_block(RoadmapBlock("under_employed", "Under Employed", "Employment", 6, 0))
graph.add_block(RoadmapBlock("unemployed", "Unemployed", "Employment", 6, 0))
graph.add_block(RoadmapBlock("marriage_cert", "Marriage Certificate", "Entry", 1, 100))


# Blue Blocks (Economic/Housing)
graph.add_block(RoadmapBlock("rental", "Rental", "Economics", 1, 1200))  # First month rent (all estimations)
graph.add_block(RoadmapBlock("homeownership", "Homeownership", "Economics", 6, 30000))  # Down payment  (all estimations)
graph.add_block(RoadmapBlock("retail_investment", "Retail Investment", "Economics", 3, 5000))

# Define the subgraph for study
study_graph = RoadmapGraph(start_id="study_start", end_id="study_end")

# Start and End blocks
study_graph.add_block(RoadmapBlock("study_start", "Begin Study Selection", "Study", 0, 0))
study_graph.add_block(RoadmapBlock("study_end", "Complete Study Program", "Study", 0, 0))

# Fields of study
fields = [
    ("study_cs", "Computer Science", 12, 15000),
    ("study_health", "Health Sciences", 18, 18000),
    ("study_law", "Law", 24, 22000),
    ("study_trades", "Skilled Trades", 10, 8000),
    ("study_ai", "Artificial Intelligence", 16, 16000),
    ("study_business", "Business Administration", 14, 14000),
]

# Add each study field as a block and connect from start to end
for block_id, title, time, cost in fields:
    study_graph.add_block(RoadmapBlock(block_id, f"Study: {title}", "Study", time, cost))
    study_graph.connect_blocks("study_start", block_id)
    study_graph.connect_blocks(block_id, "study_end")

# Replace 'study' in the main graph with a new block that wraps the subgraph
graph.blocks["study"] = RoadmapBlock(
    "study",
    "Study (Field Selection)",
    "Core",
    0,  # Top-level block time/cost could be 0 since it's abstracted
    0,
    subgraph=study_graph
)






# Prospective immigrant entry paths
graph.connect_blocks("prospective", "study")
graph.connect_blocks("prospective", "startup_visa")
graph.connect_blocks("prospective", "investor")
graph.connect_blocks("prospective", "rental")

# Study → forward paths
graph.connect_blocks("study", "permit_open")
graph.connect_blocks("study", "spouse_family")

# Spouse/Family → permit open
graph.connect_blocks("spouse_family", "permit_open")

# Property / housing progression
graph.connect_blocks("rental", "homeownership")
graph.connect_blocks("rental", "unemployed")

# Employment path from unemployment
graph.connect_blocks("unemployed", "under_employed")
graph.connect_blocks("under_employed", "equitable_employment")

# Startup Visa paths
graph.connect_blocks("startup_visa", "lmia")
graph.connect_blocks("startup_visa", "equitable_employment")

# LMIA → Equitable Employment
graph.connect_blocks("lmia", "equitable_employment")

# Foreign investor → LMIA
graph.connect_blocks("investor", "lmia")

# Work permit open → employment / residency
graph.connect_blocks("permit_open", "unemployed")
graph.connect_blocks("permit_open", "temp_resident")
graph.connect_blocks("permit_open", "equitable_employment")

#Equitable employment forward blocks
graph.connect_blocks("equitable_employment", "permit_closed")

# Work permit closed → residency
graph.connect_blocks("permit_closed", "temp_resident")

# Rental → Permanent Residency (e.g. long-term presence implication)
graph.connect_blocks("rental", "perm_resident")

cli(graph)