import TestCentre from "../models/test.centre.model.js"

export const createTestCentre = async (req, res) => {
    try {
        const { name, address, phone, email, digital_report, availability } = req.body
        if (!name || !address || !phone || !email) 
        {
            return res.status(400).json({ message: "All required fields must be provided" })
        }
        const testCentre = new TestCentre({ name, address, phone, email, digital_report, availability })
        await testCentre.save()
        res.status(201).json({ message: "Test Centre created successfully", testCentre });
    } catch (error) {
        res.status(500).json({ message: "Error creating Test Centre", error: error.message });
    }
};

export const getAllTestCentres = async (req, res) => {
    try {
        const testCentres = await TestCentre.find();
        if (testCentres.length === 0) {
            return res.status(404).json({ message: "No Test Centres found" })
        }
        res.status(200).json({ count: testCentres.length, testCentres })
    } catch (error) {
        res.status(500).json({ message: "Error fetching Test Centres", error: error.message })
    }
}

export const getTestCentreById = async (req, res) => {
    try {
        const testCentre = await TestCentre.findById(req.params.id)
        if (!testCentre) 
        {
            return res.status(404).json({ message: "Test Centre not found" })
        }
        res.status(200).json(testCentre)
    } catch (error) 
    {
        res.status(500).json({ message: "Error fetching Test Centre", error: error.message });
    }
};

export const updateTestCentre = async (req, res) => {
    try {
        const { name, address, phone, email, digital_report, availability } = req.body

        const testCentre = await TestCentre.findById(req.params.id)
        if (!testCentre) {
            return res.status(404).json({ message: "Test Centre not found" })
        }

        testCentre.name = name || testCentre.name
        testCentre.address = address || testCentre.address
        testCentre.phone = phone || testCentre.phone
        testCentre.email = email || testCentre.email
        testCentre.digital_report = digital_report ?? testCentre.digital_report
        testCentre.availability = availability ?? testCentre.availability
        await testCentre.save()
        res.status(200).json({ message: "Test Centre updated successfully", testCentre });
    } catch (error) {
        res.status(500).json({ message: "Error updating Test Centre", error: error.message });
    }
};

export const deleteTestCentre = async (req, res) => {
    try {
        const testCentre = await TestCentre.findByIdAndDelete(req.params.id)
        if (!testCentre) {
            return res.status(404).json({ message: "Test Centre not found" })
        }
        res.status(200).json({ message: "Test Centre deleted successfully", testCentre });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Test Centre", error: error.message });
    }
};
