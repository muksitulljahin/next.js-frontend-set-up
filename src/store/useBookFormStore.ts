import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookFormState {
  titleEn: string;
  titleBn: string;
  code: string;
  totalPage: string;
  categoryCode: string;
  classCode: string;
  authorNameEn: string;
  authorNameBn: string;
  setField: (
    field: keyof Omit<BookFormState, "setField" | "resetForm">,
    value: string,
  ) => void;
  resetForm: () => void;
}

export const useBookFormStore = create<BookFormState>()(
  persist(
    (set) => ({
      titleEn: "",
      titleBn: "",
      code: "",
      totalPage: "",
      categoryCode: "",
      classCode: "",
      authorNameEn: "",
      authorNameBn: "",
      setField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),
      resetForm: () =>
        set({
          titleEn: "",
          titleBn: "",
          code: "",
          totalPage: "",
          categoryCode: "",
          classCode: "",
          authorNameEn: "",
          authorNameBn: "",
        }),
    }),
    {
      name: "biddaneer-create-book-form",
    },
  ),
);
