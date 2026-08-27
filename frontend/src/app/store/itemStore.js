"use client"
import { toast } from "sonner";
import { create } from "zustand"

export const useItemStore = create((set,get)=>({
    items : [],
    isPosting : false,
    isSearching : false,
    hasSearched : false,
    postItem : async function(data) {
        
        set({isPosting : true})
        try {
            const res = await fetch("http://localhost:6767/api/items/post",
                {
                    // Basically we are sending item info as json 
                    method : "POST",
                    headers : {'Content-Type': 'application/json'},
                    body : JSON.stringify(data),
                    credentials : "include",
                    cache : "no-store"
                })
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message || "Item Posting failed")
            }
            return true;
            
        }

        catch(error) {
            toast.error(`The error shown is :  ${error.message}`);
            return false;
        }
        finally {
            set({isPosting : false})
        }
    },

    searchItems : async function(data) {
        set({isSearching : true});
        set({hasSearched : false});
        set({items : []})
        try {
            const res = await fetch(
                `http://localhost:6767/api/items/search?title=${data}`,
                // We generally don't need credentials unless only logged-in users can search.
                {
                    cache : "no-store",
                    credentials : "include",
                }
            )
            const response = await res.json()
            if(!res.ok) {
                console.log(`Error : ${response.message}`);
                set({items : []}); return;
            }
            set({items : response})
        }
        catch(error) {
            console.log(`Error in search controller : ${error.message}`)
        }
        finally { 
            set({isSearching : false});
            set({hasSearched : true});
        }
    },
    // handleSearch : function() {set({hasSearched:false})},
    singleItem : null,
    isLoadingItem : true,

    getSingleItem : async function(itemid) {
        set({isLoadingItem:true});
        try {
            const res = await fetch(
                `http://localhost:6767/api/items/item/${itemid}`,
                {cache:"no-store"}
            )
            const response = await res.json();
            if(!res.ok) {
                set({singleItem: null});
                throw new Error(response.message);
            }
            set({singleItem: response});
            return response

        }

        catch(error) {
            toast.error(error.message)
            return null;
        }

        finally {
            set({isLoadingItem:false}); 
        }
    },

    myItems : [],
    isMyItemsLoading : true,

    getMyItems : async function() {
        set({isMyItemsLoading : true})
        set({myItems : []})
        try {
            const res = await fetch(`http://localhost:6767/api/items/myItems`,
                {
                    credentials:"include",
                    cache : "no-store"
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message)
            }
            set({myItems : response})
            return response
        }
        catch(error) {
            set({myItems : []})
            toast.error(error.message);
            return null;
        }
        finally {
            set({isMyItemsLoading : false}) 
        }
    },
    
    isLoadingItemToBeEdited : true,
    isEditing : false,
    editItem : async function(itemId,data) {
        set({isEditing : true})
        try {
            const res = await fetch(`http://localhost:6767/api/items/item/${itemId}/edit`,
                {
                    method : "PATCH",
                    headers : {'Content-Type': 'application/json'},
                    credentials : "include",
                    cache : "no-store",
                    body : JSON.stringify(data)
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message);
            }
            set((state)=>({
                myItems :  state.myItems.map((item)=>{
                    if(item._id===itemId) return response;
                    return item;
                })
            }))
            toast.success("Item edited successfully");
            const copyItems = [...get().myItems]
            return copyItems;
        }
        catch(error) {
            toast.error(error.message);
            return null;
        }
        finally {
            set({isEditing : false})
        }
    },
    
    deleteItem : async function(itemid) {
        try {
            const res = await fetch(`http://localhost:6767/api/items/delete/${itemid}`,
                {
                    method : "DELETE",
                    credentials : "include",
                }
            )
            const response = await res.json();
            if(!res.ok) {
                throw new Error(response.message);
            }
            // state is the current snapshot of my whole Zustand store object.(Here itemStore obj)
            set((state)=>({
                myItems : state.myItems.filter(
                    (item)=>{
                        if(itemid==item._id) return false; 
                        return true
                    }
                )
            }))

            toast.success(response.message)
            return [...get().myItems]
        }
        catch(error) {
            toast.error(error.message);
            return null;
        }
    }
}));