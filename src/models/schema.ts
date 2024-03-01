import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing the form data
interface FormData  extends Document {
    fullName: string;
    email: string;
    password: string;
    photo: string; // Assuming photo is stored as a base64 string
}

// Define a Mongoose schema corresponding to the FormData interface
const FormDataSchema = new Schema<FormData>({
    fullName: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    photo: { type: String, required: false }
});

// Define a Mongoose model using the FormData schema
const FormDataModel = mongoose.models.Attandance|| mongoose.model('Attandance', FormDataSchema);

export default FormDataModel ;

// import mongoose ,{ Schema, model, Document } from 'mongoose';

// interface MyDocument extends Document {
//   title: string;
//   description: string;
// }

// const mySchema = new Schema<MyDocument>({
//   title: { type: String, required: false },
//   description: { type: String, required: false },
// });

// // const MyModel = model<MyDocument>('MyModel', mySchema);
// const MyModel = mongoose.models.todo || mongoose.model("todo", mySchema);


// export default MyModel;
