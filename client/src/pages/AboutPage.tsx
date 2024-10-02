import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Database, Shield, Search, Smartphone } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="h-screen w-screen overflow-x-hidden px-10">
      <Header />
      <div className="container">
        <h1 className="text-4xl font-bold mb-6 text-center my-5">About Our Anti-Counterfeiting System</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is Blockchain-Based Anti-Counterfeiting?</CardTitle>
            <CardDescription>
              Our system uses blockchain technology to create a secure, transparent, and immutable record of product authenticity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Blockchain technology provides a decentralized and tamper-proof ledger that records every step of a product's journey,
              from manufacturing to the end consumer. This creates a reliable way to verify the authenticity of products and combat counterfeiting.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" />
                Product Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Manufacturers register their products on our blockchain, creating a unique digital identity for each item.
                This includes details such as serial number, date of manufacture, and product specifications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2" />
                Secure Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                As the product moves through the supply chain, each transfer of ownership or location change is recorded on the blockchain,
                creating an immutable history of the product's journey.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2" />
                Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Consumers and retailers can easily verify a product's authenticity by scanning a QR code or entering the product's
                serial number into our verification portal, which checks against the blockchain record.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2" />
                Consumer Interaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our mobile app allows consumers to instantly check product authenticity, view the product's journey,
                and access additional information about the product.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is blockchain technology?</AccordionTrigger>
            <AccordionContent>
              Blockchain is a decentralized, digital ledger technology that records transactions across many computers.
              Each record, or block, is linked and secured using cryptography, making it extremely difficult to alter retroactively.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How does this system prevent counterfeiting?</AccordionTrigger>
            <AccordionContent>
              By creating a unique, verifiable digital identity for each product and recording its entire journey on an immutable blockchain,
              our system makes it extremely difficult for counterfeiters to introduce fake products into the supply chain.
              Any discrepancy between a product and its blockchain record immediately flags it as potentially counterfeit.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Is my data secure on the blockchain?</AccordionTrigger>
            <AccordionContent>
              Yes, blockchain technology is inherently secure due to its decentralized nature and cryptographic principles.
              However, we also implement additional security measures to protect sensitive information and ensure compliance with data protection regulations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Can this system be used for any type of product?</AccordionTrigger>
            <AccordionContent>
              Our anti-counterfeiting system is versatile and can be adapted to a wide range of products, from luxury goods and pharmaceuticals to electronics and automotive parts.
              We work closely with manufacturers to tailor the solution to their specific needs and product characteristics.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer/>
    </div>
  )
}