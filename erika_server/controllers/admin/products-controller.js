const { ImageUploadUtil } = require("../../helper/Cloudinary");
const Product = require("../../models/Product");




const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');

    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await ImageUploadUtil(url);

    res.json({
      succes: true,
      result,


    });


  }
  catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error uploading image",
    });

  }
};


//add a new products
const addProduct = async (req, res) => {
  try {
    const { image, title, description, detail,benefits, category, brand, price, salePrice, totalStock } = req.body;

    const newlyCreatedProduct = new Product({
      image, title, description, detail,benefits, category, brand, price, salePrice, totalStock ,
    });
    console.log("add title:", title);
  await newlyCreatedProduct.save();
  res.status(201).json({
    success: true,
    data: "Product added successfully",
  });

  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
    })
  }
}



//fetch all the producta

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
    })
  }
}


//edit a product

const editProduct = async (req, res) => {
  
  try {
    
    const {id}= req.params;
    const { image, title, description, detail,benefits, category, brand, price, salePrice, totalStock } = req.body;

    

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    findProduct.title = title || findProduct.title;

    findProduct.description = description || findProduct.description;

    findProduct.detail = detail || findProduct.detail;

    findProduct.benefits = benefits || findProduct.benefits;

    findProduct.category = category || findProduct.category;

    findProduct.brand = brand || findProduct.brand;

    findProduct.price = price === ''? 0: price || findProduct.price;

    findProduct.salePrice = salePrice ===''? 0 : salePrice || findProduct.salePrice;

    findProduct.totalStock = totalStock || findProduct.totalStock;

    findProduct.image = image || findProduct.image


    
    await findProduct.save();
    res.status(200).json({
      success: true,

      message: "product Edited",
      data: findProduct,
    });


  }
  catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error adding product",
    })
  }
}


//delete a product

const deleteProduct = async (req, res) => {
  try {

    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);

    if(!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
    res.status(200).json({
      succes: true,
      message : "Product deleted SuccessFully",
    })

  
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
    })
  }
}




module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };