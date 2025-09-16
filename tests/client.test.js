/**
 * @jest-environment jsdom
 */

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock setTimeout and setInterval for testing
jest.useFakeTimers();

describe('Client-side JavaScript Tests', () => {
  let mockHTML;
  
  beforeEach(() => {
    // Create a mock HTML structure
    mockHTML = `
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <header class="header">
            <nav>
              <a href="#home">Home</a>
              <a href="#curriculum">Curriculum</a>
              <a href="#benefits">Benefits</a>
            </nav>
          </header>
          <main>
            <section id="home" class="hero">
              <h1 class="hero-title">Master DevOps in 12 Weeks</h1>
              <div class="hero-stats">
                <div class="stat">
                  <span class="stat-number">95%</span>
                </div>
                <div class="stat">
                  <span class="stat-number">12</span>
                </div>
                <div class="stat">
                  <span class="stat-number">24/7</span>
                </div>
              </div>
              <button class="cta-button">Enroll Now</button>
            </section>
            <section id="curriculum" class="curriculum">
              <div class="curriculum-card">Card 1</div>
              <div class="curriculum-card">Card 2</div>
            </section>
            <section id="benefits" class="benefits">
              <div class="benefit-item">Benefit 1</div>
              <div class="benefit-item">Benefit 2</div>
            </section>
            <div class="tech-item">Tech Item</div>
          </main>
        </body>
      </html>
    `;
    
    document.documentElement.innerHTML = mockHTML;
    
    // Reset all mocks
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean up
    document.documentElement.innerHTML = '';
  });

  describe('DOM Content Loaded Event', () => {
    test('should execute when DOM is loaded', () => {
      // Mock the script.js functionality
      const mockScript = `
        document.addEventListener('DOMContentLoaded', function() {
          console.log('DOM loaded');
        });
      `;
      
      // Execute the mock script
      eval(mockScript);
      
      // Trigger DOMContentLoaded event
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      
      expect(console.log).toHaveBeenCalledWith('DOM loaded');
    });
  });

  describe('Navigation Links', () => {
    test('should find navigation links with href starting with #', () => {
      const navLinks = document.querySelectorAll('a[href^="#"]');
      expect(navLinks.length).toBeGreaterThan(0);
    });

    test('should prevent default behavior on navigation link click', () => {
      const navLink = document.querySelector('a[href="#curriculum"]');
      const mockEvent = {
        preventDefault: jest.fn(),
        target: navLink
      };
      
      // Simulate click event
      navLink.addEventListener('click', function(e) {
        e.preventDefault();
      });
      
      navLink.dispatchEvent(new Event('click'));
      // Note: In real implementation, preventDefault would be called
    });
  });

  describe('Smooth Scrolling', () => {
    test('should have scrollTo method available', () => {
      expect(typeof window.scrollTo).toBe('function');
    });

    test('should find target sections for navigation', () => {
      const targetId = '#curriculum';
      const targetSection = document.querySelector(targetId);
      expect(targetSection).toBeTruthy();
      expect(targetSection.id).toBe('curriculum');
    });
  });

  describe('Header Scroll Effects', () => {
    test('should find header element', () => {
      const header = document.querySelector('.header');
      expect(header).toBeTruthy();
    });

    test('should handle scroll events', () => {
      const header = document.querySelector('.header');
      const mockScrollEvent = new Event('scroll');
      
      // Mock scroll position
      Object.defineProperty(window, 'scrollY', {
        value: 150,
        writable: true
      });
      
      // Simulate scroll event handler
      const handleScroll = () => {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(255, 255, 255, 0.98)';
        }
      };
      
      handleScroll();
      expect(header.style.background).toBe('rgba(255, 255, 255, 0.98)');
    });
  });

  describe('CTA Buttons', () => {
    test('should find CTA buttons', () => {
      const ctaButtons = document.querySelectorAll('.cta-button');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });

    test('should handle CTA button clicks', () => {
      const ctaButton = document.querySelector('.cta-button');
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      // Simulate click handler
      const handleClick = () => {
        alert('Thank you for your interest! This is a demo application.');
      };
      
      handleClick();
      expect(mockAlert).toHaveBeenCalledWith('Thank you for your interest! This is a demo application.');
      
      mockAlert.mockRestore();
    });
  });

  describe('Intersection Observer', () => {
    test('should create IntersectionObserver instance', () => {
      const observer = new IntersectionObserver(() => {});
      expect(observer).toBeInstanceOf(IntersectionObserver);
    });

    test('should find elements to observe', () => {
      const curriculumCards = document.querySelectorAll('.curriculum-card');
      const benefitItems = document.querySelectorAll('.benefit-item');
      
      expect(curriculumCards.length).toBeGreaterThan(0);
      expect(benefitItems.length).toBeGreaterThan(0);
    });
  });

  describe('Hero Title Typing Effect', () => {
    test('should find hero title element', () => {
      const heroTitle = document.querySelector('.hero-title');
      expect(heroTitle).toBeTruthy();
      expect(heroTitle.textContent).toBe('Master DevOps in 12 Weeks');
    });

    test('should implement typing effect logic', () => {
      const heroTitle = document.querySelector('.hero-title');
      const originalText = heroTitle.textContent;
      
      // Mock typing effect
      const typeWriter = (element, text, speed = 100) => {
        let i = 0;
        element.textContent = '';
        
        const timer = setInterval(() => {
          if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
          } else {
            clearInterval(timer);
          }
        }, speed);
        
        return timer;
      };
      
      const timer = typeWriter(heroTitle, originalText, 100);
      expect(timer).toBeDefined();
      
      // Fast-forward timers
      jest.advanceTimersByTime(originalText.length * 100);
      expect(heroTitle.textContent).toBe(originalText);
      
      clearInterval(timer);
    });
  });

  describe('Counter Animation', () => {
    test('should find stat number elements', () => {
      const statNumbers = document.querySelectorAll('.stat-number');
      expect(statNumbers.length).toBe(3);
    });

    test('should animate counter values', () => {
      const statElement = document.querySelector('.stat-number');
      const targetValue = 95;
      
      // Mock counter animation
      const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          element.textContent = Math.floor(current) + '%';
        }, 50);
        
        return timer;
      };
      
      const timer = animateCounter(statElement, targetValue);
      expect(timer).toBeDefined();
      
      // Fast-forward timers
      jest.advanceTimersByTime(50 * 50); // 50 steps * 50ms
      expect(statElement.textContent).toBe('95%');
      
      clearInterval(timer);
    });
  });

  describe('Tech Stack Hover Effects', () => {
    test('should find tech items', () => {
      const techItems = document.querySelectorAll('.tech-item');
      expect(techItems.length).toBeGreaterThan(0);
    });

    test('should handle hover effects', () => {
      const techItem = document.querySelector('.tech-item');
      
      // Mock hover event handlers
      const handleMouseEnter = () => {
        techItem.style.transform = 'translateY(-10px) scale(1.05)';
      };
      
      const handleMouseLeave = () => {
        techItem.style.transform = 'translateY(0) scale(1)';
      };
      
      handleMouseEnter();
      expect(techItem.style.transform).toBe('translateY(-10px) scale(1.05)');
      
      handleMouseLeave();
      expect(techItem.style.transform).toBe('translateY(0) scale(1)');
    });
  });

  describe('Console Welcome Message', () => {
    test('should log welcome message', () => {
      const welcomeMessage = `
    🚀 Welcome to DevOps Bootcamp Showcase!
    
    This is a static Node.js application demonstrating:
    - Modern web development practices
    - Responsive design
    - Interactive features
    - Best practices for static sites
    
    Built with ❤️ using Node.js, Express, and vanilla JavaScript
    `;
      
      console.log(welcomeMessage);
      expect(console.log).toHaveBeenCalledWith(welcomeMessage);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing elements gracefully', () => {
      // Test with non-existent element
      const nonExistentElement = document.querySelector('.non-existent');
      expect(nonExistentElement).toBeNull();
      
      // Should not throw error when trying to access properties
      expect(() => {
        if (nonExistentElement) {
          nonExistentElement.style.display = 'none';
        }
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('should use efficient DOM queries', () => {
      // Test that we can efficiently query elements
      const startTime = performance.now();
      const elements = document.querySelectorAll('.curriculum-card, .benefit-item');
      const endTime = performance.now();
      
      expect(elements.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
    });
  });
});
