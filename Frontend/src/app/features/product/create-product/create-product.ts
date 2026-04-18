import { Component, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Upload } from '../../../services/upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product.html',
  styleUrl: './create-product.css',
})
export class CreateProduct {
  product: any = {
    productName: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    available: true,
    imageUrl: '',
  };

  categories: any[] = [];
  loading = false;
  isSaving = false;
  selectedFile!: File;
  uploading = false;
  errors: { [key: string]: string } = {};
  fileInputRef: any;

  constructor(
    private uploadService: Upload,
    private productService: ProductService,
    private categoryservice: CategoryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadCategories();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileInputRef = event.target;
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.product.productName || this.product.productName.trim() === '') {
      this.errors['productName'] = 'Product name is required';
    }

    if (!this.product.description || this.product.description.trim() === '') {
      this.errors['description'] = 'Description is required';
    }

    if (!this.product.price || this.product.price <= 0) {
      this.errors['price'] = 'Price must be greater than 0';
    }

    if (!this.product.quantity || this.product.quantity < 0) {
      this.errors['quantity'] = 'Quantity must be 0 or greater';
    }

    if (!this.product.categoryId || this.product.categoryId === '') {
      this.errors['categoryId'] = 'Please select a category';
    }

    if (!this.product.imageUrl || this.product.imageUrl.trim() === '') {
      this.errors['imageUrl'] = 'Please upload a product image';
    }

    return Object.keys(this.errors).length === 0;
  }

  async uploadImage() {
    if (!this.selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    this.uploading = true;
    this.cd.detectChanges();
    console.log('Selected file:', this.selectedFile);

    try {
      const res: any = await this.uploadService.getSignedUrl(this.selectedFile.name, this.selectedFile.type).toPromise();
      await this.uploadService.uploadToS3(res.signedUrl, this.selectedFile).toPromise();
      
      this.product.imageUrl = res.signedUrl.split('?')[0]; // Extract the URL without query parameters
      console.log('Image uploaded successfully, file URL:', this.product.imageUrl);
      //alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      this.product.imageUrl = '';
    } finally {
      this.uploading = false;
      this.cd.detectChanges(); // Force change detection to show preview immediately
    }
  }

  CreateProduct() {
    if(this.isSaving) return; // Prevent multiple submissions

    if (!this.validateForm()) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    this.isSaving = true;
    this.loading = true;
    this.productService.createProduct(this.product).subscribe(
      (res) => {
        alert('Product created successfully!');
        this.resetForm();
        this.loading = false;
        this.isSaving = false;

      },
      (error) => {
        alert('Error creating product. Please try again.');
        this.loading = false;
        this.isSaving = false;

      }
    );
  }

  loadCategories(){
   this.categoryservice.getAllCategories().subscribe((res) => {
      this.categories = res;
      this.cd.detectChanges();
    });
  }

  resetForm() {
    this.product = {
      productName: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: '',
      available: true,
      imageUrl: '',
    };
    this.selectedFile = undefined as any;
    this.errors = {};
    // Clear file input
    if (this.fileInputRef) {
      this.fileInputRef.value = '';
    }
    this.cd.detectChanges();
  }
}
