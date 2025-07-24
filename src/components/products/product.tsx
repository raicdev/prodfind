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
import { CalendarRange, DollarSign, RefreshCcw, Heart } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
        {product.images && product.images.length > 0 && (
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
          <span>・</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1">
                  <Heart size="18" className="fill-foreground" />
                  <span className="font-medium">
                    {product.recommendationCount || 0}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Recommendations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <CalendarRange size="18" />
                    <span className="text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Created at</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>・</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <RefreshCcw size="18" />
                    <span className="text-sm">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Updated at</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row gap-2 items-center">
        <Button variant="outline" className="w-full md:max-w-1/2" asChild>
          <Link href={`/product/${product.id}`}>View Details</Link>
        </Button>
        {product.links && product.links.length > 0 && (
          <Button asChild className="w-full md:max-w-1/2">
            <Link href={product.links[0].url.toString()} target="_blank">
              Play
            </Link>
          </Button>
        )}
        {(!product.links || product.links.length === 0) && (
          <Button variant="outline" className="w-full md:max-w-1/2" disabled>
            Not available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
