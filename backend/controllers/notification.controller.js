import Notification from "../models/notification.model.js"

export const createNotification=async(req,res)=>{
    try{
        const notification=new Notification(req.body)
        await appointment.save()
        res.status(201).json(notification)
    }catch(error){
        res.status(500).json({ message: error.message })
        console.log(error)
    }
}

export const readAllNotifications=async(req,res)=>{
    try{
        const notifications= await Notification.find().populate('patient')
        res.status(200).json(notifications)
    }catch(error){
        res.status(500).json({ message: error.message })
        console.log(error)
    }
}

export const readNotificationById=async(req,res)=>{
    try{
        const notification = await Notification.findById(req.params.id).populate('patient')
        if(!notification)
        {
            return res.status(404).json({ message: 'Notification not found' })
        }
        res.status(200).send(notification)
    }catch(error){
        res.status(500).json({ message: error.message })
        console.log(error)
    }
}
