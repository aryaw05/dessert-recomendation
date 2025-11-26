"use client";

import { Spinner } from "@/components/ui/spinner";
import { DropdownComponent } from "@/components/fragments/dropdown";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function Home() {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  useEffect(() => {
    localStorage.setItem(
      "selectedIngredients",
      JSON.stringify(selectedIngredients)
    );
  }, [selectedIngredients]);
  async function generate() {
    if (selectedIngredients.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      const data = await res.json();
      console.log("Response data:", data);
      toast.success("Resep berhasil dibuat", {
        position: "top-center",
      });
      if (data.error) {
        setError(data.error.message);
        return;
      }

      setData(data);
    } catch (err) {
      setError("An unexpected error occurred.");
      toast.error("Gagal membuat resep", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      {/* Header */}
      <header className="font-extrabold container w-full py-20 border-b-gray-300 mx-auto text-center">
        <h1 className="md:text-5xl font-monserrat text-3xl">
          🍨 Dessert Recomendation 🧁
        </h1>
        <h2>Masukkan bahan yang kamu punya , biar Ai yang meraciknya</h2>
      </header>

      {/* Dropdown */}
      <div className="bg-white space-y-10 container mx-auto md:max-w-4xl max-w-2xl border p-10 mb-10  rounded-lg">
        <h1 className="text-xl">Pilih Bahan Dessert 🍰</h1>
        <DropdownComponent
          selectedIngredients={selectedIngredients}
          onIngredientsChange={setSelectedIngredients}
        />
        <button
          disabled={loading || selectedIngredients.length === 0}
          onClick={generate}
          className={`${
            loading ? "pointer-events-none bg-orange-200" : "bg-orange-300 "
          } py-2 px-5 rounded-lg w-full`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Spinner />
              <span className="ml-2">Generating...</span>
            </span>
          ) : (
            "✨Buat Resep Sekarang"
          )}
        </button>
      </div>

      {/* Result Resep */}
      <div className="bg-white container mx-auto  h-fit border  max-w-4xl p-10 rounded-lg">
        {data ? (
          <div className="space-y-5">
            <div>
              <h1 className="font-bold  text-3xl">{data.result.name}</h1>
              <p>Durasi memasak : {data.result.cookingTime}</p>
              <p>{data.result.description}</p>
            </div>
            <div>
              <h2 className="font-bold text-xl">🛒 Bahan Bahan :</h2>
              <ul>
                {data.result.ingredients.map((ing, idx: number) => (
                  <div key={idx}>
                    <li>
                      {ing.quantity} {ing.item} {ing.unit}{" "}
                      {ing.note && `, ${ing.note}`}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-xl">🍳 Instruksi :</h2>
              <ol className="list-decimal list-inside space-y-2 ">
                {data.result.steps.map((step: string, idx: number) => (
                  <li key={idx}>{step.description}</li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          "no data"
        )}
      </div>
    </div>
  );
}
