import React from "react";
import { Product as ProductType } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarRange, DollarSign, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function Product({ product }: { product: ProductType | null }) {
  // This component should render the product details
  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not found</CardTitle>
          <CardDescription>No product found</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Explore products</Button>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card className="!gap-4">
      <CardHeader>
        {product.images.length > 0 && (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <DollarSign size="18" />
          <span className="font-medium">{product.price}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarRange size="18" />
          <span className="text-sm">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
          <span>・</span>
          <RefreshCcw size="18" />
          <span className="text-sm">
            {new Date(product.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row gap-2 items-center">
        <Button variant="outline" className="w-full md:max-w-1/2">
          View Details
        </Button>
        {product.links.length > 0 && (
        <Button asChild className="w-full md:max-w-1/2">
          <Link href={product.links[0].url.toString()} target="_blank">
            Play
            </Link>
          </Button>
        )}
        {product.links.length === 0 && (
          <Button variant="outline" className="w-full md:max-w-1/2" disabled>
            Not available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
