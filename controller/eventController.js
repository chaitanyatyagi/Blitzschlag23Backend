const xlsx = require("xlsx");
const path = require("path");
const Events = require("../model/userModel")
const User = require("../model/userModel")
const Registration=require('../model/registrations')
const worksheetColumns = [
    "Name",
    "Email",
    "InstituteID",
    "BlitzId",
    "Mobile",
]

const exportToExcel =async (raw_data, worksheetColumns, worksheetname, filePath,res) => {
    const data = raw_data.map((user) => {
        return [user.name, user.email, user.instituteId, user.blitzId, user.phone];
    })
    const workbook = xlsx.utils.book_new();
    const worksheetdata = [
        worksheetColumns,
        ...data
    ]
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetdata);
    xlsx.utils.book_append_sheet(workbook, worksheet, worksheetname);
    await xlsx.writeFileAsync( path.resolve(filePath),workbook,{},()=>{res.download(path.resolve(filePath))});
}


exports.eventDetails = async (req, res, next) => {
    const newEvent = await Events.create({
        price: req.body.price,
        eventName: req.body.eventName
    })
    return res.status(200).json({
        status: "success",
        newEvent
    })
}

exports.eventRegisteration = async (req, res, next) => {
    const event = await Events.find({ eventName: req.body.eventName })
    const updatedUser = await User.updateOne({
        _id: req.user._id
    },
    {
        $push: { registeredEvents: event._id },
        $set: { pronites: true }
    },
    {
        new: true,
        runValidators: true,
    })
    
    res.download("uploads/Resume.pdf")
    return res.status(200).json({
        status: "success",
        updatedUser
    })
}

exports.fetchList=async(req,res,next)=>{
    let ename =req.query.ename;
    if(!ename){
        return res.sendStatus(400);
    }
    try{
        const data = await Registration.find({"eventName.name":ename},{userId:1,_id:0})
        // console.log(data);
        const array=await Promise.all(
            data.map(async(id,index)=>{
                const entry = await User.findOne({_id:id.userId},{name:1,email:1,blitzId:1,instituteId:1,phone:1,_id:0});
                return entry;
            })
            );
        await exportToExcel(array, worksheetColumns, `Registrations--${ename}`, `excels/${ename}.xlsx`,res);
        // res.download(`excels/${ename}.xlsx`);
            

    // return res.send(array);


    }
    catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

// exports.proniteRegistration