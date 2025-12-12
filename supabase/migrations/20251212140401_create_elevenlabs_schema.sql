/*
  # ElevenLabs Voice Agent Platform Schema

  ## Overview
  This migration creates the complete database schema for the ElevenLabs voice agent platform,
  including agents, tools, phone numbers, knowledge base, conversations, and analytics data.

  ## New Tables

  ### `agents`
  Stores voice agent configurations and settings
  - `id` (uuid, primary key) - Unique agent identifier
  - `name` (text) - Agent display name
  - `prompt` (text) - System prompt for the agent
  - `first_message` (text) - Initial greeting message
  - `language` (text) - Agent language (default: en)
  - `voice_id` (text) - ElevenLabs voice identifier
  - `access_level` (text) - Access control level
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `tools`
  Stores custom tools/functions available to agents
  - `id` (uuid, primary key) - Unique tool identifier
  - `name` (text) - Tool name
  - `description` (text) - Tool description
  - `tool_type` (text) - Type: webhook, function, api
  - `config` (jsonb) - Tool configuration
  - `created_at` (timestamptz) - Creation timestamp

  ### `agent_tools`
  Junction table linking agents to their available tools
  - `agent_id` (uuid, foreign key) - References agents
  - `tool_id` (uuid, foreign key) - References tools
  - Primary key: (agent_id, tool_id)

  ### `phone_numbers`
  Stores phone numbers for inbound/outbound calls
  - `id` (uuid, primary key) - Unique identifier
  - `phone_number` (text) - E.164 format phone number
  - `provider` (text) - Phone provider (twilio, etc)
  - `label` (text) - Display label
  - `sid` (text) - Provider SID
  - `agent_id` (uuid, foreign key) - Associated agent
  - `created_at` (timestamptz) - Creation timestamp

  ### `knowledge_base`
  Stores knowledge base documents and files
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Document name
  - `type` (text) - Document type (pdf, txt, url, etc)
  - `content` (text) - Document content or URL
  - `metadata` (jsonb) - Additional metadata
  - `created_at` (timestamptz) - Creation timestamp

  ### `agent_knowledge`
  Junction table linking agents to knowledge base items
  - `agent_id` (uuid, foreign key) - References agents
  - `knowledge_id` (uuid, foreign key) - References knowledge_base
  - Primary key: (agent_id, knowledge_id)

  ### `conversations`
  Stores conversation records and metadata
  - `id` (uuid, primary key) - Unique conversation identifier
  - `agent_id` (uuid, foreign key) - Associated agent
  - `phone_number` (text) - Caller phone number
  - `duration_seconds` (integer) - Call duration
  - `status` (text) - Conversation status
  - `transcript` (text) - Conversation transcript
  - `metadata` (jsonb) - Additional metadata
  - `started_at` (timestamptz) - Start timestamp
  - `ended_at` (timestamptz) - End timestamp

  ### `usage_stats`
  Stores usage statistics for analytics
  - `id` (uuid, primary key) - Unique identifier
  - `agent_id` (uuid, foreign key) - Associated agent
  - `date` (date) - Statistics date
  - `character_count` (integer) - Characters processed
  - `call_count` (integer) - Number of calls
  - `total_duration_seconds` (integer) - Total call duration
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public access policies for demo purposes (can be restricted later)
*/

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prompt text DEFAULT '',
  first_message text DEFAULT 'Hello! How can I help you today?',
  language text DEFAULT 'en',
  voice_id text,
  access_level text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  tool_type text DEFAULT 'webhook',
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create agent_tools junction table
CREATE TABLE IF NOT EXISTS agent_tools (
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  PRIMARY KEY (agent_id, tool_id)
);

-- Create phone_numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL UNIQUE,
  provider text DEFAULT 'twilio',
  label text DEFAULT '',
  sid text,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text DEFAULT 'text',
  content text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create agent_knowledge junction table
CREATE TABLE IF NOT EXISTS agent_knowledge (
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  knowledge_id uuid REFERENCES knowledge_base(id) ON DELETE CASCADE,
  PRIMARY KEY (agent_id, knowledge_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  phone_number text,
  duration_seconds integer DEFAULT 0,
  status text DEFAULT 'completed',
  transcript text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create usage_stats table
CREATE TABLE IF NOT EXISTS usage_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  date date NOT NULL,
  character_count integer DEFAULT 0,
  call_count integer DEFAULT 0,
  total_duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, date)
);

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow public read access to agents"
  ON agents FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to agents"
  ON agents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to agents"
  ON agents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to agents"
  ON agents FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to tools"
  ON tools FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to tools"
  ON tools FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to tools"
  ON tools FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to tools"
  ON tools FOR DELETE
  USING (true);

CREATE POLICY "Allow public access to agent_tools"
  ON agent_tools FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to phone_numbers"
  ON phone_numbers FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to phone_numbers"
  ON phone_numbers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to phone_numbers"
  ON phone_numbers FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to phone_numbers"
  ON phone_numbers FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to knowledge_base"
  ON knowledge_base FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to knowledge_base"
  ON knowledge_base FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to knowledge_base"
  ON knowledge_base FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to knowledge_base"
  ON knowledge_base FOR DELETE
  USING (true);

CREATE POLICY "Allow public access to agent_knowledge"
  ON agent_knowledge FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to conversations"
  ON conversations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to usage_stats"
  ON usage_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to usage_stats"
  ON usage_stats FOR INSERT
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_started_at ON conversations(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_stats_agent_date ON usage_stats(agent_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_agent_id ON phone_numbers(agent_id);
