import { ProductList } from "@/components/ProductList";
import { Categories } from "@/components/navigation/Categories";
import { BannerList } from "@/components/Banner/BannerList";
import React from "react";
import { VStack } from "@/components/ui/vstack";

export default function HomeScreen() {
  return (
    <VStack className="flex-1">
      <Categories />
      <BannerList position="home" horizontal width={350} height={180} />
      <ProductList />
    </VStack>
  );
}


