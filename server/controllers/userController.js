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

        return res.status(200).send({ 
            message: 'User logged in successfully',
            access: token 
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user)
            return res.status(404).send({ message: "User not found" });

        return res.status(200).send({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports.updateAdmin = (req, res) => {
    return User.findById(req.params.id)
    .then(user => {

        if(user) {
                
            if(user.isAdmin) {
                return  res.status(200).send({ 
                        message: 'User already admin', 
                        user: user
                    })
            }
            
            user.isAdmin = true 

            user.save();

            return res.status(201).send({
                    success: true,
                    message: 'User updated as admin successfully'
                });
                
        } else {

            return res.status(404).send({ message: 'User not found' })
        
        }
    })
    .catch(error => errorHandler(error, req, res));

}

module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; 


    const hashedPassword = await bcrypt.hash(newPassword, 10);


    await User.findByIdAndUpdate(id, { password: hashedPassword });


    res.status(201).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};