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
    'members',
    'payment'
]

const exportToExcel = async (raw_data, worksheetColumns, worksheetname, filePath, res) => {
    const data = raw_data.map((user) => {
        return [user.name, user.email, user.instituteId, user.blitzId, user.phone, user.teamName, user.members,user.payment];
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
        const data = await Registration.find({ "eventName.name": ename })
        console.log(data);
        const array = await Promise.all(
            data.map(async (id, index) => {
                // console.log("hey", id.userId);
                const entry = await User.findById(id.userId, { name: 1, email: 1, blitzId: 1, instituteId: 1, phone: 1, _id: 0 });
                console.log("entry", entry);
                if (entry) {
                    entry['phone'] = id.phone;
                    entry['teamName'] = id.teamName;
                    entry['members'] = id.members;
                    entry['payment']=id.eventName.verifiedPayment;
                    return entry;
                }
                else return { 'phone': id.phone, 'members': id.members, 'teamName': id.teamName ,'payment':id.eventName.verifiedPayment}
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

const worksheetColumn = [
    "Name",
    "Email",
    "Mobile",
]

const exportToExcelUser = async (raw_data, worksheetColumns, worksheetname, filePath, res) => {
    const data = raw_data.map((user) => {
        if (user) {
            return [user.name, user.email, user.phone];
        }
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


exports.userList = async (req, res, next) => {
    const users = await User.find()
    const array = await Promise.all(
        users.map((user, indx) => {
            const email = user.email
            if (email) {
                return { 'name': user.name, 'email': user.email, 'phone': user.phone }
            }
        })
    )
    // console.log(array)
    await exportToExcelUser(array, worksheetColumn, `Registered Users`, `excels/users.xlsx`, res);
}

const collegeWorksheetColumn = [
    "Name",
    "Mobile",
    "Institute-Id",
    "Email",
    "Blitz-Id"
]

exports.collegeList = async (req, res, next) => {
    const data = await Registration.find({ "eventName.college": false }, {
        userId: 1, _id: 0, phone: 1, teamName: 1, members: 1
    })
    const array = await Promise.all(
        data.map(async (user, indx) => {
            const entry = await User.findById(user.userId, { name: 1, email: 1, blitzId: 1, instituteId: 1, phone: 1, _id: 0 })
            if (entry) {
                entry['phone'] = user.phone;
                entry['teamName'] = user.teamName;
                entry['members'] = user.members;
                return entry;
            }
            else return { 'phone': user.phone, 'members': user.members, 'teamName': user.teamName }
        })
    )
    await exportToExcel(array, collegeWorksheetColumn, `Other College Registrations`, `excels/college-false.xlsx`, res);
}