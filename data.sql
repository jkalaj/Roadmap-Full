Okay, here is the SQL data structure representing the complete roadmap graph, designed to be compatible with the concepts in your Python code.

This SQL structure uses three tables:

Blocks: Stores the information for each node (block) in the graph.

Connections: Stores the directed edges (connections) between blocks.

Subgraphs: Identifies blocks that contain nested subgraphs and specifies their start/end points.

BEGIN TRANSACTION;

-- Table to store the individual blocks (nodes) of the roadmap
CREATE TABLE Blocks (
    id TEXT PRIMARY KEY,       -- Unique identifier for the block
    title TEXT NOT NULL,       -- Display title of the block
    category TEXT NOT NULL,    -- Category (e.g., Status, Core, Employment, Economics, Entry, Study)
    average_time REAL NOT NULL,-- Estimated average time in months
    cost REAL NOT NULL         -- Estimated cost in currency units
);

-- Table to store the connections (directed edges) between blocks
CREATE TABLE Connections (
    from_id TEXT NOT NULL,     -- ID of the source block
    to_id TEXT NOT NULL,       -- ID of the destination block
    PRIMARY KEY (from_id, to_id),
    FOREIGN KEY (from_id) REFERENCES Blocks(id),
    FOREIGN KEY (to_id) REFERENCES Blocks(id)
);

-- Table to link parent blocks to their subgraph start and end nodes
CREATE TABLE Subgraphs (
    parent_block_id TEXT PRIMARY KEY, -- ID of the block in the main graph that contains the subgraph
    start_block_id TEXT NOT NULL,    -- ID of the starting block within the subgraph
    end_block_id TEXT NOT NULL,      -- ID of the ending block within the subgraph
    FOREIGN KEY (parent_block_id) REFERENCES Blocks(id),
    FOREIGN KEY (start_block_id) REFERENCES Blocks(id), -- Assumes subgraph blocks are also in the main Blocks table
    FOREIGN KEY (end_block_id) REFERENCES Blocks(id)    -- Assumes subgraph blocks are also in the main Blocks table
);

-- ========================================
--          INSERT BLOCK DATA
-- ========================================

-- Tier 0: Starting / Prospective
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('prospective', 'Prospective Immigrant', 'Status', 0, 0),
('visitor', 'Visitor', 'Entry', 0.5, 100),
('digital_nomad', 'Digital Nomad Visa', 'Entry', 2, 200),
('etravel', 'E-Travel Visa', 'Entry', 0.5, 50);

-- Tier 1: Initial Paths / Temporary Status Related
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('study', 'Study (Field Selection)', 'Core', 0, 0), -- Container for subgraph
('spouse_family', 'Spouse/Family', 'Core', 6, 1000),
('startup_visa', 'Startup Visa', 'Core', 6, 4000),
('investor', 'Foreign Investor', 'Core', 6, 10000),
('rental', 'Rental', 'Economics', 1, 1200),
('asylum', 'Asylum/Refugee', 'Status', 12, 0),
('marriage_cert', 'Marriage Certificate', 'Entry', 1, 100); -- 'Entry' seems appropriate as it enables 'Spouse/Family' path

-- Tier 2: Temporary Work / Employment / Housing
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('permit_open', 'Work Permit Open', 'Core', 2, 155),
('lmia', 'LMIA', 'Core', 3, 1000),
('equitable_employment_temp', 'Equitable Employment', 'Employment', 3, 0), -- Unique ID for top section
('under_employed_temp', 'Under Employed', 'Employment', 6, 0), -- Unique ID for top section
('unemployed_temp', 'Unemployed', 'Employment', 6, 0), -- Unique ID for top section
('homeownership_temp', 'Homeownership', 'Economics', 6, 30000), -- Unique ID for top section
('permit_closed', 'Work Permit Closed', 'Core', 2, 155);

-- Tier 3: Temporary Resident Status
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('temp_resident', 'Temporary Resident', 'Status', 1, 200); -- Time/Cost might represent renewal or maintaining status

-- Tier 4: Permanent Residency Paths
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('express_entry', 'Express Entry', 'Core', 6, 1325),
('nom_prov', 'Nomination Provincial', 'Core', 9, 1000),
('nom_atlantic', 'Nomination Atlantic', 'Core', 9, 1000),
('nom_rural', 'Nomination Rural Community', 'Core', 9, 1000);

-- Tier 5: Permanent Resident Status
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('perm_resident', 'Permanent Residency', 'Status', 6, 500);

-- Tier 6: Post-Permanent Residency / Citizenship Path
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('study_perm', 'Study', 'Core', 12, 15000), -- Unique ID for bottom section (assuming different context/requirements)
('unemployed_perm', 'Unemployed', 'Employment', 6, 0), -- Unique ID for bottom section
('under_employed_perm', 'Under Employed', 'Employment', 6, 0), -- Unique ID for bottom section
('equitable_employment_perm', 'Equitably Employment', 'Employment', 3, 0), -- Unique ID for bottom section
('homeownership_perm', 'Homeownership', 'Economics', 6, 30000), -- Unique ID for bottom section
('citizenship', 'Citizenship', 'Status', 6, 630);

-- Tier 7: Post-Citizenship / Long Term
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('retail_investment', 'Retail Investment', 'Economics', 3, 5000),
('retiree', 'Retiree (65+)', 'Status', 0, 0);

-- Study Subgraph Blocks
INSERT INTO Blocks (id, title, category, average_time, cost) VALUES
('study_start', 'Begin Study Selection', 'Study', 0, 0),
('study_end', 'Complete Study Program', 'Study', 0, 0),
('study_cs', 'Study: Computer Science', 'Study', 12, 15000),
('study_health', 'Study: Health Sciences', 'Study', 18, 18000),
('study_law', 'Study: Law', 'Study', 24, 22000),
('study_trades', 'Study: Skilled Trades', 'Study', 10, 8000),
('study_ai', 'Study: Artificial Intelligence', 'Study', 16, 16000),
('study_business', 'Study: Business Administration', 'Study', 14, 14000);


-- ========================================
--       INSERT CONNECTION DATA
-- ========================================

-- Prospective Immigrant connections
INSERT INTO Connections (from_id, to_id) VALUES
('prospective', 'visitor'),
('prospective', 'digital_nomad'),
('prospective', 'etravel'),
('prospective', 'study'),
('prospective', 'startup_visa'),
('prospective', 'investor'),
('prospective', 'rental');

-- Visitor connections
INSERT INTO Connections (from_id, to_id) VALUES ('visitor', 'asylum'); -- As observed in graph

-- Marriage Certificate connection
INSERT INTO Connections (from_id, to_id) VALUES ('marriage_cert', 'spouse_family');

-- Asylum/Refugee connection
INSERT INTO Connections (from_id, to_id) VALUES ('asylum', 'temp_resident');

-- Study connections (main graph level)
INSERT INTO Connections (from_id, to_id) VALUES
('study', 'spouse_family'),
('study', 'permit_open');

-- Spouse/Family connections
INSERT INTO Connections (from_id, to_id) VALUES ('spouse_family', 'permit_open');

-- Startup Visa connections
INSERT INTO Connections (from_id, to_id) VALUES
('startup_visa', 'lmia'),
('startup_visa', 'equitable_employment_temp');

-- Foreign Investor connections
INSERT INTO Connections (from_id, to_id) VALUES ('investor', 'lmia');

-- LMIA connections
INSERT INTO Connections (from_id, to_id) VALUES ('lmia', 'equitable_employment_temp');

-- Work Permit Open connections
INSERT INTO Connections (from_id, to_id) VALUES
('permit_open', 'unemployed_temp'),
('permit_open', 'temp_resident'); -- Direct path to Temp Resident status seems implied

-- Equitable Employment (Temporary) connections
INSERT INTO Connections (from_id, to_id) VALUES ('equitable_employment_temp', 'permit_closed');

-- Work Permit Closed connections
INSERT INTO Connections (from_id, to_id) VALUES ('permit_closed', 'temp_resident');

-- Rental connections
INSERT INTO Connections (from_id, to_id) VALUES
('rental', 'homeownership_temp'),
('rental', 'unemployed_temp'); -- Renting might precede unemployment or vice versa

-- Employment status connections (Temporary section)
INSERT INTO Connections (from_id, to_id) VALUES
('unemployed_temp', 'under_employed_temp'),
('under_employed_temp', 'equitable_employment_temp');

-- Temporary Resident connections (leading to PR paths)
INSERT INTO Connections (from_id, to_id) VALUES
('temp_resident', 'express_entry'),
('temp_resident', 'nom_prov'),
('temp_resident', 'nom_atlantic'),
('temp_resident', 'nom_rural');
-- Also direct connection observed in some interpretations, but typically via a program:
-- ('temp_resident', 'perm_resident');  -- Keep commented unless explicitly intended

-- Permanent Residency Program connections (leading to PR status)
INSERT INTO Connections (from_id, to_id) VALUES
('express_entry', 'perm_resident'),
('nom_prov', 'perm_resident'),
('nom_atlantic', 'perm_resident'),
('nom_rural', 'perm_resident');

-- Permanent Residency connections
INSERT INTO Connections (from_id, to_id) VALUES
('perm_resident', 'study_perm'),
('perm_resident', 'unemployed_perm'),
('perm_resident', 'citizenship'); -- Main path forward

-- Study (Permanent section) connections
INSERT INTO Connections (from_id, to_id) VALUES ('study_perm', 'equitable_employment_perm');

-- Employment status connections (Permanent section)
INSERT INTO Connections (from_id, to_id) VALUES
('unemployed_perm', 'under_employed_perm'),
('under_employed_perm', 'equitable_employment_perm');

-- Equitable Employment (Permanent section) connections
INSERT INTO Connections (from_id, to_id) VALUES ('equitable_employment_perm', 'homeownership_perm');

-- Homeownership (Permanent section) connections
INSERT INTO Connections (from_id, to_id) VALUES ('homeownership_perm', 'retail_investment');

-- Citizenship connections
INSERT INTO Connections (from_id, to_id) VALUES
('citizenship', 'retail_investment'),
('citizenship', 'retiree');

-- Study Subgraph Connections
INSERT INTO Connections (from_id, to_id) VALUES
('study_start', 'study_cs'),
('study_start', 'study_health'),
('study_start', 'study_law'),
('study_start', 'study_trades'),
('study_start', 'study_ai'),
('study_start', 'study_business'),
('study_cs', 'study_end'),
('study_health', 'study_end'),
('study_law', 'study_end'),
('study_trades', 'study_end'),
('study_ai', 'study_end'),
('study_business', 'study_end');


-- ========================================
--          INSERT SUBGRAPH DATA
-- ========================================

INSERT INTO Subgraphs (parent_block_id, start_block_id, end_block_id) VALUES
('study', 'study_start', 'study_end');


COMMIT;


Explanation and Notes:

Unique IDs: IDs like equitable_employment_temp, unemployed_perm, study_perm, etc., were created to distinguish blocks with the same title appearing in different parts of the graph (e.g., before and after Permanent Residency).

Categories: Categories were assigned based on the general theme and color-coding observed in the image and initial Python code.

Time/Cost: Values are taken directly from your initial Python code snippet. Where blocks were added based on the image but not in the snippet, default values (like 0 or reasonable guesses based on similar blocks) were used, matching the structure required by RoadmapBlock. You might need to adjust these.

Connections: All visible connections from the graph image have been translated into (from_id, to_id) pairs.

Subgraphs: The Subgraphs table explicitly links the study block in the main graph to the study_start and study_end blocks, which define the entry and exit points for the study field selection subgraph.

Compatibility: This SQL structure stores the necessary information (id, title, category, average_time, cost, connections, and subgraph links) to reconstruct the graph topology as defined by your RoadmapBlock and RoadmapGraph classes. You would need to write Python code to query these tables and populate your RoadmapGraph instance if you want to load from this SQL data.

HS/LS and Arrow Colors: As noted previously, the "HS/LS" skill indicators and the green/red arrow meanings (value/constraint) are not part of the provided RoadmapBlock class structure and are therefore not included in this SQL representation. You would need to modify the Python classes and the SQL schema to accommodate this extra information if required.