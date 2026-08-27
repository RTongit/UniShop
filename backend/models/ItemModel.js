import mongoose from "mongoose";
const ItemSchema = new mongoose.Schema(
    {
        seller : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        title : {
            type : String,
            required : true,
            trim : true,
            maxlength : 300,
        }, 

        category : {
            type : String,
            required : true,
            trim : true,
        },

        brand : {
            type : String,
            trim : true,
            default : ""
        },

        description : {
            type : String,
            maxlength : 4096,
            required : true,
        },

        price : {
            type : Number,
            // built in validator : 
            min : [0,"Price cannot be negative"],
            required : true,
        },

        photos: {
            type: [String],
            // A custom validator 
            validate : {
                validator : function(value) {
                    if(value.length>0) return true;
                    return false;
                },
                message : "Must add atleast one photo"
            },
            required : true
        },

        // todo : need to enhance
        isSold : {
            type : Boolean,
            default : false
        },
        pickupLocation: {
            type : String,
            required : true,
            trim : true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
        // Will add later this : 
        // availableUntil : {
        //     type : Date,
        //     default : null
        // }
    },

    {
        timestamps : true
    }
);

const Item = mongoose.model("Item",ItemSchema);
export default Item;