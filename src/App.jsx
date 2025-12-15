import Navbar from "./components/Navbar"
import Hero from "./sections/Hero"
import Experience from "./sections/Experience"
import Skills from "./sections/Skills"
import Work from "./sections/Work"
import Contact from "./sections/Contact"
import GitHubSkyline from "./sections/GitHubSkyline"
import Footer from "./components/Footer"

const App = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Work />
            <Experience />
            <Skills />
            <GitHubSkyline />
            <Contact />
            <Footer />
        </>

    )
}

export default App