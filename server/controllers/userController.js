const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../auth");

module.exports.register = (req, res) => {

    
    if(!req.body.email.includes('@')){

        return res.status(400).send({ message: 'Invalid email format' });

    } else if (req.body.password.length < 8) {

        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });

    } else { 

        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()

        .then((result) => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))

        .catch(error => errorHandler(error, req, res))
        
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).send({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).send({ message: "Invalid credentials" });

        const token = createAccessToken(user);

        return res.status(200).send({ access: token });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).send({ message: "User not found" });

        return res.status(200).send({ user: user });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};
