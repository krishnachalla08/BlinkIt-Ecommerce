import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
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
  selectedProduct: any = null;
  visibleProducts: Product[] = [];
  totalProductsCount: number = 0;

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  

  openQuickView(product: any) {
    console.log('Opening quick view for:', product);
    this.selectedProduct = product;
  }

  closeQuickView() {
    this.selectedProduct = null;
  }

  addToCart(product: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (product?.quantity === 0) {
      return; // Prevent adding to cart if out of stock
    }

    this.cartService.addToCart(product);
  }

  getCartQuantity(product: any): number {
    if (!product) return 0;
    const pId = product.id || product.productId;
    const item = this.cartService.cartItems().find(i => i.productId === pId);
    return item ? item.quantity : 0;
  }

  incrementQuantity(product: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const qty = this.getCartQuantity(product);
    if (qty === 0) {
      this.addToCart(product);
    } else {
      this.cartService.updateQuantity(product.id || product.productId, qty + 1);
    }
  }

  decrementQuantity(product: any): void {
    const qty = this.getCartQuantity(product);
    if (qty > 0) {
      this.cartService.updateQuantity(product.id || product.productId, qty - 1);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load categories and products using forkJoin for better error handling
    this.loadStartTime = Date.now();

    forkJoin({
      categories: this.categoryService.getAllCategories(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: (result) => {
        this.finishLoading(() => {
          this.categories = Array.isArray(result.categories) ? result.categories : result.categories?.content || [];
          const products = Array.isArray(result.products) ? result.products : result.products?.content || [];

          this.categorizeProducts(products);
          this.totalProductsCount = products.length;
          this.updateVisibleProducts();
          this.loading = false;
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
    // Skip the artificial delay if the data came from cache instantly
    const delay = elapsed < 50 ? 0 : Math.max(0, this.minLoadingTimeMs - elapsed);
    setTimeout(() => {
      this.zone.run(() => {
        action();
        this.cdr.detectChanges();
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
    this.updateVisibleProducts();
  }

  updateVisibleProducts(): void {
    if (this.selectedCategory === 'All') {
      this.visibleProducts = Object.values(this.categorizedProducts).flat().concat(this.miscellaneousProducts);
    } else if (this.selectedCategory === 'Miscellaneous') {
      this.visibleProducts = this.miscellaneousProducts;
    } else {
      this.visibleProducts = this.categorizedProducts[this.selectedCategory] || [];
    }
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
      return this.totalProductsCount;
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
