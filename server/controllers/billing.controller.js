const User = require('../models/user.model.js');
const Project = require('../models/project.model.js');
const crypto = require('crypto');

const PLANS = {
    free: {
        id: 'free',
        name: 'Starter',
        priceMonthly: 0,
        priceAnnual: 0,
        credits: 10,
        maxProjects: 3,
        features: [
            '10 AI Generations',
            '3 Active Projects',
            'Standard Preview & Monaco Editor',
            'Instant ZIP Export',
            'Community Support'
        ]
    },
    pro: {
        id: 'pro',
        name: 'Professional',
        priceMonthly: 19,
        priceAnnual: 15,
        credits: 500,
        maxProjects: 50,
        features: [
            '500 AI Generations per month',
            'Unlimited Active Projects',
            'Priority AI Inference Pipeline',
            'One-Click Live Edge Hosting',
            'Unlimited Project Version Snapshots',
            'Full Source Code Download',
            '24/7 Priority Support'
        ]
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonthly: 99,
        priceAnnual: 79,
        credits: 2500,
        maxProjects: 500,
        features: [
            '2,500 AI Generations per month',
            'Custom AI Models & Fine-Tuning',
            'Dedicated Edge CDN & Custom Domains',
            'Team Collaboration & Roles',
            '99.99% Guaranteed SLA',
            'Dedicated Success Engineer'
        ]
    }
};

exports.getPlans = async (req, res) => {
    return res.json({ plans: Object.values(PLANS) });
};

exports.getUsage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('plan credits totalGenerations').lean();
        const projectCount = await Project.countDocuments({ owner: req.user._id });
        const planConfig = PLANS[user?.plan] || PLANS.free;

        return res.json({
            plan: user?.plan || 'free',
            planName: planConfig.name,
            creditsRemaining: user?.credits ?? 10,
            totalCredits: planConfig.credits,
            totalGenerations: user?.totalGenerations || 0,
            projectCount,
            maxProjects: planConfig.maxProjects
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to load usage data' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { planId = 'pro', billingCycle = 'monthly' } = req.body;
        const targetPlan = PLANS[planId];
        if (!targetPlan || planId === 'free') {
            return res.status(400).json({ message: 'Invalid subscription plan' });
        }

        const price = billingCycle === 'annual' ? targetPlan.priceAnnual * 12 : targetPlan.priceMonthly;
        const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        return res.json({
            orderId,
            planId,
            planName: targetPlan.name,
            billingCycle,
            amount: price * 100,
            currency: 'USD',
            displayAmount: `$${price}`,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_mode'
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create checkout order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { planId = 'pro' } = req.body;
        const targetPlan = PLANS[planId];
        if (!targetPlan) {
            return res.status(400).json({ message: 'Unknown plan' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                plan: planId,
                $inc: { credits: targetPlan.credits }
            },
            { new: true }
        ).select('-__v');

        return res.json({
            message: `Successfully upgraded to ${targetPlan.name} plan!`,
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({ message: 'Payment verification failed' });
    }
};
