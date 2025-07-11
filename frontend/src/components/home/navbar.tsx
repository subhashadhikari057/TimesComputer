import Link from "next/link"
import Image from "next/image"

export default function Navbar() {

  const navLinks =[
    {title:"Home",href:"/"},
    {title:"About",href:"/about"},
    {title:"Blog",href:"/blog"},
    {title:"More",href:"/more"},
]

  return (
    <header className="sticky top-0 z-50">
      <nav className="flex w-full pl-[8.64vw] pr-[14.01vw] py-10 h-[7.5vh] items-center text-primary justify-between">
      <div >
       <Image
        src = "/logo.png"
        alt = "Brand Logo"
        width = {56}
        height = {56}
        />
      </div>
      <div className="flex items-center  justify-center gap-20">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className= ""
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div className="flex flex-col font-semibold text-primary text-[18px]">
        <span>contact us?</span>
        <Link href="tel:+9779808113344">
         9808113344
        </Link>
      </div>
    </nav>
    <section className="flex w-full pl-[8.64vw] pr-[14.01vw] py-10 h-[7.5vh] items-center bg-primary justify-between">

    </section>
    </header>
  )
}
