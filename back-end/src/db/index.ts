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
        await pool.query(
            "CREATE TABLE IF NOT EXISTS projects (project_id SERIAL PRIMARY KEY, project_name VARCHAR(255) NOT NULL, tanggal_penilaian DATE, predicate VARCHAR(32), status VARCHAR(255));"+" "+
            "CREATE TABLE IF NOT EXISTS grades (grade VARCHAR(32), upper_limit INT, lower_limit INT);"+" "+
            "CREATE TABLE IF NOT EXISTS chapters (chapter_id SERIAL PRIMARY KEY, project_id INTEGER NOT NULL, chapter_name VARCHAR(255) NOT NULL, chapter_weight INT NOT NULL, CONSTRAINT fk_project_id FOREIGN KEY(project_id) REFERENCES projects(project_id) ON DELETE CASCADE);"+" "+
            "CREATE TABLE IF NOT EXISTS grading_parameters (parameter_id SERIAL PRIMARY KEY, chapter_id INTEGER NOT NULL, parameter_name VARCHAR(255) NOT NULL, CONSTRAINT fk_chapter_id FOREIGN KEY(chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE);"+" "+
            "CREATE TABLE IF NOT EXISTS sub_aspects (subaspect_id SERIAL PRIMARY KEY, parameter_id INTEGER NOT NULL, mistakes INTEGER NOT NULL DEFAULT '0', CONSTRAINT fk_parameter_id FOREIGN KEY(parameter_id) REFERENCES grading_parameters(parameter_id) ON DELETE CASCADE);"
        );
    } 
    catch (error) {
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