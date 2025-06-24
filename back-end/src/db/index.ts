import pg from "pg";
import format from "pg-format";
import 'dotenv/config';

const {Pool} = pg;

const DB_USER: string = process.env.PG_USER as string;
const DB_HOST: string = process.env.PG_HOST as string;
const DB: string = process.env.PG_DATABASE as string;
const DB_PASS: string = process.env.PG_PASSWORD as string;
const DB_HOST_PORT: number = parseInt(process.env.PG_PORT as string, 10);

const pool = new Pool({
    user: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    database: DB,
    port: DB_HOST_PORT
});

pool.on("connect", (client)=>{
    console.log("Connection to database establsihed");
})

pool.on("error", (err, client)=>{
    console.error("Unexpected error has occured on idle client", err);
    process.exit(-1);
})

export const dbSetup = async ()=>
{
    try 
    {
        return await pool.query(
            "CREATE TABLE IF NOT EXISTS grades (grade VARCHAR(32) PRIMARY KEY, upper_limit INT DEFAULT '90' NOT NULL, lower_limit INT DEFAULT '0' NOT NULL);"+" "+
            "CREATE TABLE IF NOT EXISTS projects (project_id SERIAL PRIMARY KEY, project_name VARCHAR(255) NOT NULL, grading_date TIMESTAMPTZ DEFAULT NOW(), grade VARCHAR(32), status VARCHAR(255), final_score INT DEFAULT '0' NOT NULL, grader_comment TEXT, CONSTRAINT fk_grade FOREIGN KEY(grade) REFERENCES grades(grade));"+" "+
            "CREATE TABLE IF NOT EXISTS chapters (chapter_id SERIAL PRIMARY KEY, project_id INTEGER NOT NULL, chapter_name VARCHAR(255) NOT NULL, chapter_weight INT NOT NULL, chapter_score INT DEFAULT '0' NOT NULL, CONSTRAINT fk_project_id FOREIGN KEY(project_id) REFERENCES projects(project_id) ON DELETE CASCADE);"+" "+
            "CREATE TABLE IF NOT EXISTS grading_parameters (parameter_id SERIAL PRIMARY KEY, chapter_id INTEGER NOT NULL, parameter_name VARCHAR(255) NOT NULL, total_mistakes INT DEFAULT '0' NOT NULL, CONSTRAINT fk_chapter_id FOREIGN KEY(chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE);"+" "+
            "CREATE TABLE IF NOT EXISTS sub_aspects (subaspect_id SERIAL PRIMARY KEY, parameter_id INTEGER NOT NULL, sub_aspect_name VARCHAR(255) NOT NULL, mistakes INT DEFAULT '0' NOT NULL, CONSTRAINT fk_parameter_id FOREIGN KEY(parameter_id) REFERENCES grading_parameters(parameter_id) ON DELETE CASCADE);"+" "+
            
            "CREATE OR REPLACE FUNCTION update_project_grade_function()"+" "+
            "RETURNS TRIGGER"+" "+
            "AS $$"+" "+
            "DECLARE new_grade VARCHAR(32); passing_score INT; score INT;"+" "+
            "BEGIN"+" "+
            "IF pg_trigger_depth() <> 1 THEN RETURN NEW; END IF;"+" "+
            "SELECT grade INTO new_grade FROM grades WHERE NEW.final_score >= lower_limit AND NEW.final_score <= upper_limit;"+" "+
            "SELECT 56 INTO passing_score; SELECT final_score INTO score FROM projects WHERE project_id = OLD.project_id;"+" "+
            "IF score >= passing_score THEN UPDATE projects SET grade = new_grade, status = 'LULUS' WHERE project_id = OLD.project_id;"+" "+
            "ELSE UPDATE projects SET grade = new_grade, status = 'TIDAK LULUS' WHERE project_id = OLD.project_id;"+" "+
            "END IF; RETURN NEW;"+" "+
            "END; $$ LANGUAGE plpgsql;"+" "+

            "CREATE OR REPLACE FUNCTION update_grading_date_function()"+" "+
            "RETURNS TRIGGER"+" "+
            "AS $$"+" "+
            "BEGIN"+" "+
            "IF pg_trigger_depth() <> 1 THEN RETURN NEW; END IF;"+" "+
            "UPDATE projects SET grading_date = NOW() WHERE project_id = OLD.project_id; RETURN NEW;"+" "+
            "END; $$ LANGUAGE plpgsql;"+" "+

            "CREATE OR REPLACE FUNCTION update_project_grade_if_grades_changed_function()"+" "+
            "RETURNS TRIGGER"+" "+
            "AS $$"+" "+
            "DECLARE new_grade VARCHAR(32); passing_score INT; score INT;"+" "+
            "BEGIN"+" "+
            "IF pg_trigger_depth() <> 1 THEN RETURN NEW; END IF;"+" "+
            "SELECT grade INTO new_grade FROM projects WHERE final_score >= NEW.lower_limit AND final_score <= NEW.upper_limit;"+" "+
            "SELECT 56 INTO passing_score; SELECT final_score INTO score FROM projects;"+" "+
            "IF score >= passing_score THEN UPDATE projects SET grade = new_grade, status = 'LULUS';"+" "+
            "ELSE UPDATE projects SET grade = new_grade, status = 'TIDAK LULUS';"+" "+
            "END IF; RETURN NEW;"+" "+
            "END; $$ LANGUAGE plpgsql;"+" "+

            "CREATE OR REPLACE TRIGGER update_project_grade_trigger"+" "+
            "AFTER UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_project_grade_function();"+" "+

            "CREATE OR REPLACE TRIGGER update_grading_date_trigger"+" "+
            "AFTER UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_grading_date_function();"+" "+

            "CREATE OR REPLACE TRIGGER update_project_grade_when_grades_is_modified_trigger"+" "+
            "AFTER UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_project_grade_if_grades_changed_function();"
        );
    } 
    catch (error) {
        console.error("Error occureed:", error);
    }
}

export const dbDrop = async ()=>{
    try
    {
        return await pool.query(
            "DROP TABLE IF EXISTS projects, grades, chapters, grading_parameters, sub_aspects CASCADE"
        );
    }
    catch(error)
    {
        console.error("Error occureed:", error);
    }
}

export const query = async (query: string, params?: Array<string>) =>{
    try 
    {
        const start = Date.now();
        const result = await pool.query(query, params);
        const duration = Date.now() - start;
        const rowsReturned = result.rowCount
        console.log("Query executed: ", {query, duration, rowsReturned});
        return result;
    } 
    catch (error) 
    {
        console.error("Error occured: ", error);
    }
}