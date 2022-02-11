const db = require('./db');
const client = db.client;
const Employee = db.Employee;
const express = require('express');
const app = express();

app.use((req,res,next) => {
    if(req.method === 'POST' && req.query._method){
        req.method = req.query._method;
    }
    next();
});

app.use(express.urlencoded({extended: false}));

app.get('/', (req,res,next) => {
    res.redirect('/employees');
});

app.get('/employees', async(req,res,next) => {
    try {
        const employees = await Employee.findAll();
        const html = employees.map(employee => {
            return `
                <div>
                    ${employee.name} <a href='/departments/${employee.department}'>${employee.department}</a>
                </div>
            `
        }).join('');
        res.send(`
            <html>
                <head>
                    <title>Acme Corp</title>
                </head>
                <body>
                    <h1>Acme Corp</h1>
                    <form method='POST'>
                        <input name='name' placeholder='name' />
                        <input name='department' placeholder='department' />
                        <button>Create</button>
                    </form>
                    ${html}
                </body>
            </html>
        `);
    } catch(ex) {
        next(ex);
    }
});

app.post('/employees', async( req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.redirect(`/departments/${employee.department}`);
    }catch (ex) {
        next(ex);
    }
});

app.delete('/employees/:id', async( req, res, next) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        await employee.destroy();
        res.redirect(`/departments ${employee.department}`);
    } catch(ex) {
        next(ex);
    }
})

app.get('/departments/:department', async (req, res, next) => {
    try {
        const department = req.params.department;
        const employees = await Employee.findAll({
            where: {department}
        });
        const html = employees.map(employee => {
            return `
                <div>
                    ${employee.name}
                    <a href='/departments/${employee.department}'>${employee.department}</a>
                    <form method='DELETE' action='/employees/${employee.id}?_method=delete'>
                        <button>x</button>
                    </form>
                </div>
            `
        }).join('');
        res.send(`
            <html>
                <head>
                    <title>Acme Corp</title>
                </head>
                <body>
                    <h1>Acme Corp ${department}</h1>
                    <a href='/'><<back</a>
                    ${html}
                </body>
            </html>
        `);
    } catch (ex) {
        next(ex);
    }
})

const start = async() => {
    try {
        console.log('starting..');
        await client.sync({force: true});
        await Employee.create({name:'moe', department:'eng'});
        await Employee.create({ name: 'lucy', department: 'eng' });
        await Employee.create({ name: 'ethyl', department: 'hr' });
        await Employee.create({ name: 'ethyl', department: 'finance' });
        
        const port = process.env.PORT || 1337;
        app.listen(port, () =>  console.log(`Port connected to ${port}`));
    }
    catch(ex) {
        console.log(ex);
    }
}
start();