const DatabaseHandler = require("../../util/DatabaseHandler");

const checkApiKey = (req) => {
    
    if (!req.headers["authorization"]) throw new Error("Unauthorized user");

    if (req.headers["authorization"] !== `Bearer ${process.env.API_TOKEN}`) throw new Error("Unauthorized user");
};

const createResident = async (req, res) => {
    const body = req.body;

    if(!body.name || !body.jobTitle || !body.address || !body.city) {
        return res.status(400).send({
            message: "All fields are required"
        });
    }

    
    let dbHandler = new DatabaseHandler();

    try {
        const resident = {
            name: body.name,
            jobTitle: body.jobTitle,
            address: body.address,
            city: body.city
        };

        const results = await dbHandler.executeQuery(
            `INSERT INTO residents SET ?`,
            resident
        );
  
        resident.id = results.insertId;

        res.status(201).send({
            resident: resident
        });
    } catch (e) {
        console.error(e);

        res.status(500).send({
            message: "Internal server error"
        });
    } finally {
      if (dbHandler) {
        await dbHandler.disconnect();
      }
    }
};

const getResidents = async (req, res) => {
    let dbHandler = new DatabaseHandler();

    try {
        const results = await dbHandler.executeQuery("SELECT id, name, jobTitle, address, city FROM residents");

        res.status(200).send({
            residents: results
        });
    } catch (e) {
        console.error(e);

        res.status(500).send({
            message: "Internal server error"
        });
    } finally {
      if (dbHandler) {
        await dbHandler.disconnect();
      }
    }
};


export default async function handler(req, res) {

    try {
        checkApiKey(req);
    } catch (e) {
        return res.status(401).send({
            message: "Unauthorized user"
        });
    }

    switch(req.method) {
        case "POST":
            return await createResident(req, res);

            break;
        case "GET":
            return await getResidents(req, res);
            break;
    }
}