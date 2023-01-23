const xlsx = require("xlsx");
const path = require("path");
const User = require("../model/userModel")
const Registration = require('../model/registrations');
const { rejects } = require("assert");
const worksheetColumns = [
    "Name",
    "Email",
    "InstituteID",
    "BlitzId",
    "Mobile",
    "teamName",
    'members'
]

const exportToExcel = async (raw_data, worksheetColumns, worksheetname, filePath, res) => {
    const data = raw_data.map((user) => {
        return [user.name, user.email, user.instituteId, user.blitzId, user.phone,user.teamName,user.members];
    })
    const workbook = xlsx.utils.book_new();
    const worksheetdata = [
        worksheetColumns,
        ...data
    ]
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetdata);
    xlsx.utils.book_append_sheet(workbook, worksheet, worksheetname);
    await xlsx.writeFileAsync(path.resolve(filePath), workbook, {}, () => { res.download(path.resolve(filePath)) });
}



exports.fetchList = async (req, res, next) => {
    let ename = req.query.ename;
    if (!ename) {
        return res.sendStatus(400);
    }
    try {
        const data = await Registration.find({ "eventName.name": ename }, { userId: 1, _id: 0 ,phone:1,teamName:1,members:1})
        console.log(data);
        const array = await Promise.all(
            data.map(async (id, index) => {
                console.log("hey",id.userId);
                const entry = await User.findById( id.userId , { name: 1, email: 1, blitzId: 1, instituteId: 1, phone: 1, _id: 0 });
                console.log("entry",entry);
                if(entry){
                    entry['phone']=id.phone;
                    entry['teamName']=id.teamName;
                    entry['members']=id.members;
                    return  entry;
                }
                else return {'phone':id.phone,'members':id.members,'teamName':id.teamName}
            })
        );
        if (ename.length > 15) {
            ename = ename.slice(0, 15);
        }
        // console.log(ename);
        console.log(array);
        await exportToExcel(array, worksheetColumns, `Registrations--${ename}`, `excels/${ename}.xlsx`, res);

    }
    catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
