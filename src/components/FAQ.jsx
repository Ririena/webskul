import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const FAQ = () => {
    const faqs = [
      {
        question: "Apa itu XI PPLG 2?",
        answer:
          "XI PPLG 2 adalah kelas di jurusan PPLG (Pengembangan Perangkat Lunak dan Gim) yang terdiri dari siswa-siswi yang mempelajari teknologi pemrograman dan pengembangan perangkat lunak.",
      },
      {
        question: "Apa saja program yang dipelajari?",
        answer:
          "Di kelas ini, kamu akan belajar berbagai hal terkait pemrograman, desain UI/UX, database, hingga pengembangan aplikasi dan gim.",
      },
      {
        question: "Bagaimana cara bergabung dengan kelas ini?",
        answer:
          "Untuk bergabung, kamu perlu mendaftar di jurusan PPLG saat masuk ke sekolah dan memilih program ini saat penjurusan.",
      },
    ];
  
    return (
      <section className="py-16 px-4 bg-gray-100 dark:bg-neutral-900">
        <h3 className="text-2xl sm:text-3xl text-center font-semibold mb-8">
          Frequently Asked Questions
        </h3>
        <div className="max-w-4xl mx-auto space-y-4">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  };
  
  export default FAQ;
  