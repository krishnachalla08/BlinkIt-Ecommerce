import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCard } from '../../features/product/product-card/product-card';

interface Category {
  categoryId: number;
  categoryName: string;
}

interface Product {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryName?: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  categorizedProducts: { [categoryName: string]: Product[] } = {};
  miscellaneousProducts: Product[] = [];
  selectedCategory = 'All';
  loading = true;
  error: string | null = null;
  private minLoadingTimeMs = 700;
  private loadStartTime = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    console.log('Starting to load data...');

    // Load categories and products using forkJoin for better error handling
    this.loadStartTime = Date.now();

    forkJoin({
      categories: this.categoryService.getAllCategories(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: (result) => {
        console.log('API Response - Categories:', result.categories);
        console.log('API Response - Products:', result.products);

        this.finishLoading(() => {
          this.categories = Array.isArray(result.categories) ? result.categories : result.categories?.content || [];
          const products = Array.isArray(result.products) ? result.products : result.products?.content || [];

          console.log('Processed categories:', this.categories);
          console.log('Processed products:', products);

          this.categorizeProducts(products);
          this.loading = false;
          console.log('Data loading completed');
        });
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.finishLoading(() => {
          this.error = 'Failed to load products. Please check if the backend is running.';
          this.loading = false;
        });
      }
    });
  }

  private categorizeProducts(products: Product[]): void {
    this.categorizedProducts = {};
    this.miscellaneousProducts = [];

    const categoryNames = new Set(this.categories.map(cat => cat.categoryName?.trim()).filter(Boolean));

    products.forEach(product => {
      const productCategory = product.categoryName?.trim();
      if (productCategory && categoryNames.has(productCategory)) {
        if (!this.categorizedProducts[productCategory]) {
          this.categorizedProducts[productCategory] = [];
        }
        this.categorizedProducts[productCategory].push(product);
      } else {
        this.miscellaneousProducts.push(product);
      }
    });
  }

  private finishLoading(action: () => void): void {
    const elapsed = Date.now() - this.loadStartTime;
    const delay = Math.max(0, this.minLoadingTimeMs - elapsed);
    setTimeout(() => {
      this.zone.run(() => {
        action();
        this.cdr.detectChanges();
        console.log('finishLoading: loading=', this.loading, 'error=', this.error);
      });
    }, delay);
  }

  getCategoryNames(): string[] {
    return Object.keys(this.categorizedProducts);
  }

  getNavigationCategories(): string[] {
    const names = this.getCategoryNames();
    const nav = ['All', ...names];
    if (this.miscellaneousProducts.length > 0) {
      nav.push('Miscellaneous');
    }
    return nav;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getVisibleProducts(): Product[] {
    if (this.selectedCategory === 'All') {
      return Object.values(this.categorizedProducts).flat().concat(this.miscellaneousProducts);
    }

    if (this.selectedCategory === 'Miscellaneous') {
      return this.miscellaneousProducts;
    }

    return this.categorizedProducts[this.selectedCategory] || [];
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'All': '🛍️',
      'Fruits': '🍎',
      'Vegetables': '🥕',
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Meat': '🥩',
      'Beverages': '🥤',
      'Snacks': '🍿',
      'Miscellaneous': '📦'
    };
    return icons[category] || '📦';
  }

  getCategoryCount(category: string): number {
    if (category === 'All') {
      return Object.values(this.categorizedProducts).flat().length + this.miscellaneousProducts.length;
    }
    if (category === 'Miscellaneous') {
      return this.miscellaneousProducts.length;
    }
    return this.categorizedProducts[category]?.length || 0;
  }

  trackByProductId(index: number, product: Product): any {
    return product.id || index;
  }
}
