import React from 'react';
import { BarChart3, Search, Shield, Upload } from 'lucide-react';

const features = [
    {
        name: 'Find Instantly',
        description: 'Search for products by name, brand, or keywords.',
        icon: Search,
    },
    {
        name: "Publish easily",
        description: "Publish your products to the world with ease.",
        icon: Upload,
    },
    {
        name: "Secure & Private",
        description: "Your searches and browsing history are not saved.",
        icon: Shield,
    },
    {
        name: "Ranking",
        description: "Rank products by recommendation count.",
        icon: BarChart3,
    },
];

export default function Features() {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
                        Why Prodfind?
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
                        Prodfind makes product discovery simple with powerful tools and intelligent features.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-foreground">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-muted-foreground">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}