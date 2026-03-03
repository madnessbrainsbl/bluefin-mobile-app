import { useCategories } from "@/hooks/useCategories";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { ScrollView } from "react-native";
import { cn } from "@/lib/helpers";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { useEffect, useRef, useState } from "react";
import React from "react";

const ScrollAwarePressable = ({
  categoryId,
  scrollViewRef,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  children: React.ReactNode;
  categoryId: number;
  scrollViewRef: React.RefObject<ScrollView>;
}) => {
  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);

  const [x, setX] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (viewCategoryId === categoryId) {
      scrollViewRef.current?.scrollTo({ x: x ?? 0, y: 0, animated: true });
    }
  }, [categories, viewCategoryId]);

  return (
    <Pressable
      onLayout={(event) => setX(event.nativeEvent.layout.x)}
      {...props}
    />
  );
};

export function Categories() {
  const { data: categories } = useCategories();
  const viewCategoryId = useCatalogStore((state) => state.viewCategoryId);
  const setViewCategoryId = useCatalogStore((state) => state.setViewCategoryId);

  useEffect(() => {
    if (!categories.length) return;

    const isValidViewCategoryId =
      viewCategoryId !== null &&
      categories.some((category) => {
        if (category.id === viewCategoryId) return true;
        return (category.sub ?? []).some((subCategory) => subCategory.id === viewCategoryId);
      });

    if (viewCategoryId === null || !isValidViewCategoryId) {
      const firstCategory = categories[0];
      if (firstCategory.sub?.length) {
        setViewCategoryId(firstCategory.sub[0].id);
      } else {
        setViewCategoryId(firstCategory.id);
      }
    }
  }, [categories, viewCategoryId, setViewCategoryId]);

  const parentCategory =
    categories.find((category) => {
      if (category.id === viewCategoryId) {
        return category;
      } else if (category.sub) {
        const sub = category.sub.find(
          (subCategory) => subCategory.id === viewCategoryId,
        );
        if (sub) {
          return category;
        }
      }
    }) ?? categories[0];

  const scrollRef = useRef<ScrollView>(null);
  const parentScrollRef = useRef<ScrollView>(null);

  return (
    <Box>
      <ScrollView horizontal ref={parentScrollRef}>
        <HStack className="border-t-2 border-outline-light bg-background py-2">
          {categories.map((category) => (
            <ScrollAwarePressable
              key={category.id}
              categoryId={category.id}
              scrollViewRef={parentScrollRef}
              className={cn(
                "mx-1.5 overflow-hidden rounded-full px-3 py-2 active:bg-surface-selected",
                {
                  "bg-surface-selected": category.id === parentCategory.id,
                },
              )}
              onPress={() => {
                scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
                if (category.sub?.length) {
                  setViewCategoryId(category.sub[0].id);
                } else {
                  setViewCategoryId(category.id);
                }
              }}
            >
              <Box>
                <HStack>
                  <Text
                    className={cn(
                      "font-bold tracking-tight text-primary-muted",
                      {
                        "text-primary-light":
                          category.id === parentCategory.id,
                      },
                    )}
                  >
                    {category.name}
                  </Text>
                </HStack>
              </Box>
            </ScrollAwarePressable>
          ))}
        </HStack>
      </ScrollView>

      {parentCategory?.sub?.length && (
        <ScrollView horizontal ref={scrollRef}>
          <HStack className="bg-background py-2">
            {parentCategory.sub.map((category) => (
              <ScrollAwarePressable
                key={category.id}
                categoryId={category.id}
                scrollViewRef={scrollRef}
                className={cn(
                  "mx-1.5 overflow-hidden rounded-full px-3 py-2 active:bg-surface-selected",
                  {
                    "bg-surface-selected": category.id === viewCategoryId,
                  },
                )}
                onPress={() => setViewCategoryId(category.id)}
              >
                <Box>
                  <HStack>
                    <Text
                      className={cn(
                        "font-bold tracking-tight text-primary-muted",
                        {
                          "text-primary-light":
                            category.id === viewCategoryId,
                        },
                      )}
                    >
                      {category.name}
                    </Text>
                  </HStack>
                </Box>
              </ScrollAwarePressable>
            ))}
          </HStack>
        </ScrollView>
      )}
    </Box>
  );
}
