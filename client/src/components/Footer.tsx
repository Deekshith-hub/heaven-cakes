export default function Footer() {
  return (
    <footer className="bg-[#43766C] text-white py-10 mt-auto">
      <div className="container mx-auto px-6 text-center md:text-left md:flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2">Heaven Cakes 🍰</h3>
          <p className="text-[#F8FAE5] opacity-80 max-w-sm">
            Crafting sweet memories with every slice. Freshly baked, purely delicious.
          </p>
        </div>
        
        <div className="mt-6 md:mt-0 flex gap-6 justify-center md:justify-end">
          <a href="#" className="hover:text-[#B19470] transition">Instagram</a>
          <a href="#" className="hover:text-[#B19470] transition">Facebook</a>
          <a href="#" className="hover:text-[#B19470] transition">Contact</a>
        </div>
      </div>
      <div className="text-center text-sm opacity-50 mt-8 border-t border-white/10 pt-4">
        © 2026 Heaven Cakes. All rights reserved.
      </div>
    </footer>
  );
}