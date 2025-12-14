import Navbar from "./components/Navbar"
import Hero from "./sections/Hero"
import Experience from "./sections/Experience"
import Skills from "./sections/Skills"
import Work from "./sections/Work"
import Contact from "./sections/Contact"

const App = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Work />
            <Experience />
            <Skills />
            <Contact />
        </>

    )
}

export default App