import React, { useState } from 'react'
import { motion } from 'motion/react'
import LoginModal from '../components/LoginModal'

const highlights = [
    "AI Generated code",
    "Fully Responsive Layouts",
    "Production Ready Output"
]

const [openLogin, setOpenLogin] = useState(false)

function Home() {
    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-lg font-semibold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent'>
                        GenWeb.ai
                    </div>
                    <div className='flex items-center gap-6'>
                        <div className='hidden md:inline text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer'>
                            Pricing
                        </div>
                        <button className='px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'>
                            Get Started
                        </button>
                    </div>
                </div>
            </motion.div>
            <section className='pt-44 p-32 px-6 text-center'>
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }} className='text-5xl md:text-7xl font-bold tracking-tight'>
                    Build Stunning Websites
                    <br />
                    <span className='bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text
                    text-transparent'>
                        with AI
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
                >
                    Describe your idea and let AI generate a modern,
                    responsive , production-ready website.
                </motion.p >
                <motion.dev>
                    <button className='mt-12 px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105' onClick={() => setOpenLogin(true)}>
                        Get Started
                    </button>
                </motion.dev>
            </section>

            <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className='grid grid-clos-1 md:grid-cols-3 gap-10'>
                    {highlights.map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className='rounded-2xl bg-white/5 border border-white/10 p-8'
                        >

                            <h1 className='text-xl font-semibold mb-3'>
                                {h}
                            </h1>
                            <p className='text-sm text-zinc-400'>
                                GenWeb.ai build real websites - clean code,
                                animations , responsiveness and scalable structure
                            </p>
                        </motion.div>
                    ))}
                </div>

            </section>

            <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
                &copy; {new Date().getFullYear()} GenWeb.ai
            </footer>
            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}

        </div>
    )
}

export default Home