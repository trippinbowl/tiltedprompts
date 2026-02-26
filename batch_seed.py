import subprocess
import time

print("TiltedPrompts Batch Seeding Tool")
print("Generating 50 High-Demand Framework Assets based on commercial analytics...")

tasks = [
    # Content & Copywriting (Highest Revenue)
    "SEO-optimized 500-word blog post in conversational tone with 3 key takeaways",
    "High-converting SaaS landing page copywriting framework",
    "LinkedIn B2B thought leadership post from raw messy notes",
    "Engaging Twitter thread template with viral hooks",
    "Podcast episode outline and show notes generator",
    "Case study story generator from rough client interview notes",
    "YouTube video script hook and retention structure generator",
    
    # Marketing & Advertising (Fast Growth)
    "10 email subject lines targeting audience pain points optimized for curiosity hooks",
    "Facebook Ad copy framework for D2C brands with strong CTA",
    "Google Search Ad headline and description generator for local services",
    "Black Friday promotional email campaign sequence for e-commerce",
    "E-commerce abandoned cart recovery email sequence",
    "Social media 30-day content calendar generator for solopreneurs",
    "Influencer outreach pitch email targeting micro-creators",
    
    # Image Generation - Midjourney (Popular niche)
    "Photorealistic cinematic portrait with detailed face, lighting, and no text for Midjourney",
    "Isometric 3D technology workspace concept design for Midjourney",
    "E-commerce product lifestyle photography on solid background for Midjourney",
    "Seamless geometric pattern generator for product packaging for Midjourney",
    "App UI UX screen mockup in modern glassmorphism style for Midjourney",
    "Cinematic cyberpunk street scene with neon lighting constraints for Midjourney",
    "Photorealistic food photography menu design composition for Midjourney",
    
    # Sales & Cold Outreach (B2B thrivers)
    "Personalized B2B LinkedIn DM referencing recent events and solving specific pain points",
    "Cold email outreach targeting C-suite executive pain points",
    "B2B SaaS objection handling script generator for SDRs",
    "Follow-up email sequence after a successful product demo",
    "Discovery call question list and BANT qualification framework",
    "SaaS enterprise pricing proposal email template",
    "Strategic partnership and joint-venture outreach email",
    
    # Logo & Graphic Design (Low competition gems)
    "Minimalist vector logo for brand with scalable primary colors and no text distortion for Midjourney",
    "Bold typographic T-shirt design concept and layout",
    "Clean tech SaaS brand icon set design constraints",
    "YouTube channel banner art layout framework and safe zones",
    "Branding color palette and typography mood board generation",
    "Modern sleek minimalist business card design concept",
    "Podcast cover art illustration design with clear typography rules",
    
    # Education & Course Creation (eLearning Boom)
    "5-module course outline for beginners with lesson objectives and activities",
    "1-hour video lesson script with learning objectives and interactive quizzes",
    "Multiple-choice quiz generator derived from textbook text",
    "Step-by-step technical software tutorial guide generator",
    "Course landing page copy to maximize student enrollment and overcome objections",
    "Student onboarding email welcome sequence for digital products",
    "Live webinar presentation script and sales pitch flow",
    
    # Resume & Job Tools (Evergreen)
    "ATS-optimized resume rewrite from job description incorporating skills and experience",
    "Cover letter personalized to company mission and specific role requirements",
    "LinkedIn profile ABOUT section optimizer for job seekers",
    "Technical interview common question and STAR method answer prep",
    "Post-interview thank you and professional follow up email template",
    "Performance review self-assessment generator for corporate employees",
    "Salary negotiation script and email template based on market research",
    "Professional resignation letter template leaving on good terms"
]

for idx, task in enumerate(tasks, start=1):
    print(f"\n[{idx}/50] Generating Asset: {task}")
    cmd = f'python openclaw/skills/tilted_framework_generator/tools.py framework --task "{task}" --count 1'
    
    # Run synchronously to not overwhelm the local Flask API or LLM
    try:
        subprocess.run(cmd, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Failed to generate asset {idx}. Moving to next. Error: {e}")
        time.sleep(5)
        
print("\nBatch Seeding Complete! All 50 assets have been pushed to the database.")
