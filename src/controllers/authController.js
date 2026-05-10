const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/tokenManager');
const { verifyGoogleToken } = require('../config/google-oauth');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            loginType: 'email',
            role: 'user',
            isEmailVerified: false,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Save refresh token
        await User.update(user.id, { refreshToken });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: user.toJSON(),
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user with email/password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if user registered with email (not Google)
        if (user.loginType !== 'email') {
            return res.status(400).json({
                success: false,
                message: `This account is registered with ${user.loginType}. Please use ${user.loginType} to login.`,
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Update last login and save refresh token
        await User.update(user.id, {
            lastLogin: new Date().toISOString(),
            refreshToken
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user.toJSON(),
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login/Register with Google
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        // Verify Google token
        const googleUser = await verifyGoogleToken(idToken);

        // Check if user exists
        let user = await User.findOne({ email: googleUser.email });

        if (user) {
            // User exists - login
            if (user.loginType !== 'google') {
                return res.status(400).json({
                    success: false,
                    message: `This email is already registered with ${user.loginType}. Please use ${user.loginType} to login.`,
                });
            }

            // Generate tokens
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            // Update last login and save refresh token
            await User.update(user.id, {
                lastLogin: new Date().toISOString(),
                refreshToken
            });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: user.toJSON(),
                token: accessToken,
                refreshToken,
            });
        } else {
            // New user - register
            user = await User.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                loginType: 'google',
                role: 'user',
                isEmailVerified: googleUser.emailVerified,
            });

            // Generate tokens
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            // Save refresh token
            await User.update(user.id, { refreshToken });

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                user: user.toJSON(),
                token: accessToken,
                refreshToken,
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Guest login
 * @route   POST /api/auth/guest
 * @access  Public
 */
const guestLogin = async (req, res, next) => {
    try {
        const { deviceId } = req.body;

        // Create or find guest user
        let user = await User.findOne({ email: `guest_${deviceId}@guest.com` });

        if (!user) {
            user = await User.create({
                name: 'Guest User',
                email: `guest_${deviceId}@guest.com`,
                loginType: 'guest',
                role: 'guest',
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Update last login and save refresh token
        await User.update(user.id, {
            lastLogin: new Date().toISOString(),
            refreshToken
        });

        res.status(200).json({
            success: true,
            message: 'Guest login successful',
            user: user.toJSON(),
            token: accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
    try {
        // Clear refresh token
        await User.update(req.user.id, { refreshToken: null });

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        // Verify refresh token
        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user.id);

        res.status(200).json({
            success: true,
            token: newAccessToken,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    googleLogin,
    guestLogin,
    getProfile,
    logout,
    refreshToken,
};
