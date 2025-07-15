// "use client";

// import { useState } from "react";
// import { Plus, Trash2, Package } from "lucide-react";
// import ComponentCard from "@/components/common/ComponentsCard";
// import DefaultInput from "@/components/form/form-elements/DefaultInput";

// interface VariantOption {
//   id: string;
//   name: string;
//   value: string;
// }

// interface VariantGroup {
//   id: string;
//   name: string;
//   options: VariantOption[];
// }


// interface VariantCombination {
//   id: string;
//   combination: { [groupId: string]: string };
//   price: number;
//   stock: number;
//   sku: string;
//   isEnabled: boolean;
// }

// interface VariantProps {
//   variants: VariantGroup[];
//   variantCombinations: VariantCombination[];
//   onVariantsChange: (variants: VariantGroup[]) => void;
//   onCombinationsChange: (combinations: VariantCombination[]) => void;
// }

// export default function Variant({
//   variants,
//   variantCombinations,
//   onVariantsChange,
//   onCombinationsChange,
// }: VariantProps) {
//   const [newGroupName, setNewGroupName] = useState("");

//   const generateId = () => Math.random().toString(36).substr(2, 9);

//   const addVariantGroup = () => {
//     if (newGroupName.trim()) {
//       const newGroup: VariantGroup = {
//         id: generateId(),
//         name: newGroupName.trim(),
//         options: [],
//       };
//       onVariantsChange([...variants, newGroup]);
//       setNewGroupName("");
//     }
//   };

//   const removeVariantGroup = (groupId: string) => {
//     const updatedVariants = variants.filter((group) => group.id !== groupId);
//     onVariantsChange(updatedVariants);

//     // Remove combinations that include this group
//     const updatedCombinations = variantCombinations.filter(
//       (combo) => !combo.combination[groupId]
//     );
//     onCombinationsChange(updatedCombinations);
//   };

//   const addVariantOption = (groupId: string) => {
//     const updatedVariants = variants.map((group) => {
//       if (group.id === groupId) {
//         const newOption: VariantOption = {
//           id: generateId(),
//           name: "",
//           value: "",
//         };
//         return { ...group, options: [...group.options, newOption] };
//       }
//       return group;
//     });
//     onVariantsChange(updatedVariants);
//   };

//   const updateVariantOption = (
//     groupId: string,
//     optionId: string,
//     field: "name" | "value",
//     value: string
//   ) => {
//     const updatedVariants = variants.map((group) => {
//       if (group.id === groupId) {
//         const updatedOptions = group.options.map((option) => {
//           if (option.id === optionId) {
//             return { ...option, [field]: value };
//           }
//           return option;
//         });
//         return { ...group, options: updatedOptions };
//       }
//       return group;
//     });
//     onVariantsChange(updatedVariants);
//   };

//   const removeVariantOption = (groupId: string, optionId: string) => {
//     const updatedVariants = variants.map((group) => {
//       if (group.id === groupId) {
//         return {
//           ...group,
//           options: group.options.filter((option) => option.id !== optionId),
//         };
//       }
//       return group;
//     });
//     onVariantsChange(updatedVariants);
//   };

//   const generateCombinations = () => {
//     if (
//       variants.length === 0 ||
//       variants.some((group) => group.options.length === 0)
//     ) {
//       onCombinationsChange([]);
//       return;
//     }

//     const combinations: VariantCombination[] = [];

//     const generateRecursive = (
//       groupIndex: number,
//       currentCombination: { [groupId: string]: string }
//     ) => {
//       if (groupIndex >= variants.length) {
//         const combinationId = generateId();
//         const combination: VariantCombination = {
//           id: combinationId,
//           combination: { ...currentCombination },
//           price: 0,
//           stock: 0,
//           sku: "",
//           isEnabled: true,
//         };
//         combinations.push(combination);
//         return;
//       }

//       const currentGroup = variants[groupIndex];
//       currentGroup.options.forEach((option) => {
//         if (option.value) {
//           generateRecursive(groupIndex + 1, {
//             ...currentCombination,
//             [currentGroup.id]: option.value,
//           });
//         }
//       });
//     };

//     generateRecursive(0, {});
//     onCombinationsChange(combinations);
//   };

//   const updateCombination = (
//     combinationId: string,
//     field: "price" | "stock" | "sku" | "isEnabled",
//     value: string | number | boolean
//   ) => {
//     const updatedCombinations = variantCombinations.map((combo) => {
//       if (combo.id === combinationId) {
//         return { ...combo, [field]: value };
//       }
//       return combo;
//     });
//     onCombinationsChange(updatedCombinations);
//   };

//   const getCombinationDisplay = (combination: {
//     [groupId: string]: string;
//   }) => {
//     return variants
//       .map((group) => {
//         const value = combination[group.id];
//         return value ? `${group.name}: ${value}` : "";
//       })
//       .filter(Boolean)
//       .join(" | ");
//   };

//   return (
//     <ComponentCard
//       title="Product Variants"
//       desc="Define product variants like size, color, material, etc."
//       className="space-y-6"
//     >
//       <div className="space-y-6">
//         {/* Add Variant Group */}
//         <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
//           <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center ">
//             <Package size={16} className="mr-2" />
//             Add Variant Group
//           </h4>
//           <div className="flex gap-3">
//             <DefaultInput
//               label=""
//               name="newGroupName"
//               value={newGroupName}
//               onChange={(e) => setNewGroupName(e.target.value)}
//               placeholder="e.g., Size, Color, Material"
//               className="flex-1"
//             />
//             <button
//               type="button"
//               onClick={addVariantGroup}
//               disabled={!newGroupName.trim()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               <Plus size={16} />
//               Add Group
//             </button>
//           </div>
//         </div>

//         {/* Variant Groups */}
//         {variants.map((group) => (
//           <div key={group.id} className="border border-gray-200 rounded-lg p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-sm font-medium text-gray-700">
//                 {group.name}
//               </h4>
//               <button
//                 type="button"
//                 onClick={() => removeVariantGroup(group.id)}
//                 className="text-red-600 hover:text-red-800 p-1"
//               >
//                 <Trash2 size={16} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {group.options.map((option) => (
//                 <div key={option.id} className="flex gap-3 items-end">
//                   <DefaultInput
//                     label="Option Name"
//                     name={`option-name-${option.id}`}
//                     value={option.name}
//                     onChange={(e) =>
//                       updateVariantOption(
//                         group.id,
//                         option.id,
//                         "name",
//                         e.target.value
//                       )
//                     }
//                     placeholder="e.g., Small"
//                     className="flex-1"
//                   />
//                   <DefaultInput
//                     label="Option Value"
//                     name={`option-value-${option.id}`}
//                     value={option.value}
//                     onChange={(e) =>
//                       updateVariantOption(
//                         group.id,
//                         option.id,
//                         "value",
//                         e.target.value
//                       )
//                     }
//                     placeholder="e.g., SM"
//                     className="flex-1"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeVariantOption(group.id, option.id)}
//                     className="text-red-600 hover:text-red-800 p-2 mb-1"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={() => addVariantOption(group.id)}
//                 className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
//               >
//                 <Plus size={14} />
//                 Add Option
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Generate Combinations Button */}
//         {variants.length > 0 && (
//           <div className="flex justify-center">
//             <button
//               type="button"
//               onClick={generateCombinations}
//               className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
//             >
//               <Package size={16} />
//               Generate Variant Combinations
//             </button>
//           </div>
//         )}

//         {/* Variant Combinations Table */}
//         {variantCombinations.length > 0 && (
//           <div className="overflow-x-auto">
//             <h4 className="text-sm font-medium text-gray-700 mb-3">
//               Variant Combinations ({variantCombinations.length})
//             </h4>
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Variant
//                   </th>
//                   <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price ($)
//                   </th>
//                   <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     SKU
//                   </th>
//                   <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {variantCombinations.map((combo) => (
//                   <tr key={combo.id}>
//                     <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {getCombinationDisplay(combo.combination)}
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap">
//                       <input
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         value={combo.price}
//                         onChange={(e) =>
//                           updateCombination(
//                             combo.id,
//                             "price",
//                             parseFloat(e.target.value) || 0
//                           )
//                         }
//                         className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:outline-none focus:ring-blue-500"
//                       />
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap">
//                       <input
//                         type="number"
//                         min="0"
//                         value={combo.stock}
//                         onChange={(e) =>
//                           updateCombination(
//                             combo.id,
//                             "stock",
//                             parseInt(e.target.value) || 0
//                           )
//                         }
//                         className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:outline-none focus:ring-blue-500 "
//                       />
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap">
//                       <input
//                         type="text"
//                         value={combo.sku}
//                         onChange={(e) =>
//                           updateCombination(combo.id, "sku", e.target.value)
//                         }
//                         placeholder="SKU"
//                         className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:outline-none focus:ring-blue-500 "
//                       />
//                     </td>
//                     <td className="px-3 py-4 whitespace-nowrap">
//                       <label className="inline-flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={combo.isEnabled}
//                           onChange={(e) =>
//                             updateCombination(
//                               combo.id,
//                               "isEnabled",
//                               e.target.checked
//                             )
//                           }
//                           className="form-checkbox h-4 w-4 text-blue-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-700">
//                           {combo.isEnabled ? "Enabled" : "Disabled"}
//                         </span>
//                       </label>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {variants.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             <Package size={48} className="mx-auto mb-4 opacity-50" />
//             <p>No variant groups added yet.</p>
//             <p className="text-sm">Add a variant group to get started.</p>
//           </div>
//         )}
//       </div>
//     </ComponentCard>
//   );
// }
