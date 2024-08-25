const Testimonials = () => {
    return (
        <section className="py-16 px-4 bg-gray-100 dark:bg-neutral-900">
            <h3 className="text-2xl sm:text-3xl text-center font-semibold mb-8">
                What Our Students Say
            </h3>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                    <p className="text-lg font-medium">
                        "This class has transformed my coding skills. The
                        projects are engaging and the support is top-notch!"
                    </p>
                    <div className="mt-4 text-right">
                        <span className="text-primary font-semibold">
                            - Alex R.
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                    <p className="text-lg font-medium">
                        "A wonderful experience with a supportive group. I’ve
                        learned so much in such a short time!"
                    </p>
                    <div className="mt-4 text-right">
                        <span className="text-primary font-semibold">
                            - Bella S.
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                    <p className="text-lg font-medium">
                        "The practical approach to learning here is fantastic.
                        I’m ready to take on real-world projects!"
                    </p>
                    <div className="mt-4 text-right">
                        <span className="text-primary font-semibold">
                            - Chris T.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
