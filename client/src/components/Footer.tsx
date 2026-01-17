export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#43766C]/10">
                 <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#43766C]">
                Heaven Cakes
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Crafting happiness with every slice. Premium Bento cakes and sweets made fresh daily.
            </p>
            
            {/* Instagram Link */}
            <a 
              href="https://instagram.com/heavencakes_subhasnagara" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 text-[#43766C] font-bold hover:text-[#B19470] transition-colors bg-[#F8FAE5] px-4 py-2 rounded-full text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @heavencakes_subhasnagara
            </a>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#1A202C] font-bold uppercase tracking-widest text-xs mb-6 border-b-2 border-[#B19470] pb-2 inline-block">
              Contact Us
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <div className="mt-1 text-[#B19470]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div className="flex flex-col">
                    <a href="tel:8550082852" className="text-gray-600 hover:text-[#43766C] transition font-medium">8550082852</a>
                    <a href="tel:9731142825" className="text-gray-600 hover:text-[#43766C] transition font-medium">9731142825</a>
                    <span className="text-xs text-gray-400 mt-1">(Phone / WhatsApp)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Locations Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#1A202C] font-bold uppercase tracking-widest text-xs mb-6 border-b-2 border-[#B19470] pb-2 inline-block">
              Our Locations
            </h3>
            
            <div className="space-y-6">
                {/* Address 1 */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                    <div className="mt-1 text-[#B19470] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Narendra Complex, Near Petrol Pump, <br/>
                        Subhasnagara, Katapadi – 574105
                    </p>
                </div>

                {/* Address 2 */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                    <div className="mt-1 text-[#B19470] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Near Canara Bank, <br/>
                        Mattu Katapadi, Mattu – 574105
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}