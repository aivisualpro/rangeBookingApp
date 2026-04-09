"use client";

import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, Wand2 } from "lucide-react";

import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@dashboardpack/core/components/ui/card";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const typeParam = searchParams.get("type");

  // Wizard state
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [showTos, setShowTos] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(password ? strength : 0);
  }, [password]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)); }
    pass += "A1!"; // guarantees hitting strong criteria
    setPassword(pass);
    setConfirmPassword(pass);
    setShowPassword(true);
  };

  const [userType, setUserType] = useState<"Internal" | "External">("Internal");
  const [externalMode, setExternalMode] = useState<"new_company" | "existing_company">("new_company");
  const [token, setToken] = useState("");

  const [companyData, setCompanyData] = useState({
    company_name: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    billing_contact_name: "",
    billing_contact_email: "",
    billing_contact_phone: "",
    company_address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const [invitedCompanyName, setInvitedCompanyName] = useState("");

  useEffect(() => {
    if (tokenParam) {
      setToken(tokenParam);
      setUserType("External");
      setExternalMode("existing_company");
      
      // Auto-skip to Step 2
      setStep(2);
      
      // Lookup the company name magically
      fetch(`/api/auth/token-lookup?token=${tokenParam}`)
        .then(r => r.ok ? r.json() : {})
        .then((data: any) => {
          if (data?.companyName) setInvitedCompanyName(data.companyName);
        })
        .catch(() => {});
        
    } else if (typeParam === "external") {
      setUserType("External");
    }
  }, [tokenParam, typeParam]);

  const isTokenLocked = !!tokenParam;
  
  const hasCompanyStep = userType === "External" && externalMode === "new_company";
  const totalSteps = hasCompanyStep ? 3 : 2;

  const nextStep = async () => {
    if (step === 1) {
      if (userType === "External" && externalMode === "existing_company" && !token.trim()) {
        toast.error("Please enter the company invite token.");
        return;
      }
    }
    if (step === 2 && hasCompanyStep) {
      if (!companyData.company_name.trim()) {
        toast.error("Company Name is required.");
        return;
      }

      // Pre-flight check on company availability
      if (companyData.company_name) {
         setLoading(true);
         try {
           const res = await fetch("/api/auth/check-company", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ company_name: companyData.company_name.trim() })
           });
           const data = await res.json();
           if (data.exists) {
             toast.warning(`The company "${companyData.company_name}" is already registered.`);
             setLoading(false);
             return;
           }
         } catch {
           console.error("Failed to verify company");
         }
         setLoading(false);
      }

      // Pre-flight check on email availability
      const checkEmailValue = companyData.primary_contact_email;
      if (checkEmailValue) {
         setLoading(true);
         try {
           const res = await fetch("/api/auth/check-email", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ email: checkEmailValue })
           });
           const data = await res.json();
           if (data.exists) {
             toast.warning(`Warning: this user is already available (as ${data.status}).`);
             setLoading(false);
             return;
           }
         } catch {
           console.error("Failed to verify email");
         }
         setLoading(false);
      }

      // Auto-fill step 3 proactively without protecting existing old values
      if (companyData.primary_contact_name) {
         setName(companyData.primary_contact_name);
      }
      if (companyData.primary_contact_email) {
         setEmail(companyData.primary_contact_email);
      }
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Final validations
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return toast.error("Please fill in all personal details.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!termsAgreed) {
        return toast.error("You must agree to the Terms of Service.");
    }
    
    setLoading(true);
    
    try {
      const payload = {
        name,
        email,
        password,
        userType,
        externalMode,
        token: userType === "External" && externalMode === "existing_company" ? token : undefined,
        companyData: userType === "External" && externalMode === "new_company" ? companyData : undefined,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Registration successful!");
      
      // All newly registered users are hardcoded to "inactive" status in the backend 
      // pending admin approval, so we can route them directly to the confirmation screen.
      router.push("/login?error=AccountInactive");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Determine current wizard state based on presence of intermediate company step
  let currentStepView;
  if (step === 1) {
    currentStepView = "Setup";
  } else if (step === 2 && hasCompanyStep) {
    currentStepView = "Company";
  } else {
    currentStepView = "Personal";
  }

  return (
    <>
      <title>Create Account — Signal Dashboard</title>
      <Card className={`w-full mx-auto shadow-xl transition-all animate-in fade-in slide-in-from-right-4 duration-500 ${currentStepView === "Company" ? "max-w-4xl" : "max-w-xl"}`}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold">
            Create your account
            {invitedCompanyName && (
              <span className="block text-xl text-primary font-medium mt-1">
                (as {invitedCompanyName})
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-sm">
            Step {step} of {totalSteps}
          </CardDescription>
          
          <div className="flex justify-center items-center gap-2 mt-4 px-10">
             <div className="h-2 flex-1 rounded-full bg-primary transition-all duration-500"></div>
             <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
             {hasCompanyStep && (
               <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
             )}
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            
            {/* STEP 1: Account & Association */}
            {currentStepView === "Setup" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* User Type Toggle */}
                <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-lg border">
                  <Label className="text-base font-semibold">Account Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button 
                      type="button" 
                      variant={userType === "Internal" ? "default" : "outline"} 
                      onClick={() => setUserType("Internal")}
                      disabled={isTokenLocked}
                      className="font-medium"
                    >
                      Internal Staff
                    </Button>
                    <Button 
                      type="button" 
                      variant={userType === "External" ? "default" : "outline"} 
                      onClick={() => setUserType("External")}
                      disabled={isTokenLocked}
                      className="font-medium"
                    >
                      External User
                    </Button>
                  </div>
                </div>

                {/* External Options */}
                {userType === "External" && (
                  <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Label className="text-base font-semibold">Company Association</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button 
                        type="button" 
                        variant={externalMode === "new_company" ? "default" : "outline"} 
                        onClick={() => setExternalMode("new_company")}
                        disabled={isTokenLocked}
                        className="font-medium h-auto py-2"
                      >
                        Register a new company
                      </Button>
                      <Button 
                        type="button" 
                        variant={externalMode === "existing_company" ? "default" : "outline"} 
                        onClick={() => setExternalMode("existing_company")}
                        disabled={isTokenLocked}
                        className="font-medium h-auto py-2"
                      >
                        Part of a company
                      </Button>
                    </div>

                    {externalMode === "existing_company" && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="token" className="font-semibold text-primary">Company Invite Token (URL)</Label>
                        <Input
                          id="token"
                          type="text"
                          placeholder="Paste your token here"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          disabled={isTokenLocked}
                          required={externalMode === "existing_company"}
                          className="bg-background border-primary/30 focus-visible:ring-primary/50"
                        />
                        {isTokenLocked && (
                          <p className="text-xs text-muted-foreground">Token successfully loaded from URL.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Company Details */}
            {currentStepView === "Company" && (
               <div className="space-y-4 p-4 border rounded-lg bg-card animate-in fade-in slide-in-from-right-4 duration-500">
                 <h3 className="font-bold text-lg border-b pb-2">Company Details</h3>
                 
                 <div className="grid grid-cols-3 gap-3">
                   <div className="space-y-2 col-span-3 lg:col-span-1">
                     <Label>Company Name *</Label>
                     <Input
                       required
                       value={companyData.company_name}
                       onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                       autoComplete="organization"
                     />
                   </div>
                   <div className="space-y-2 col-span-3 lg:col-span-2">
                     <Label>Company Address</Label>
                     <Input
                       value={companyData.company_address}
                       onChange={(e) => setCompanyData({ ...companyData, company_address: e.target.value })}
                       autoComplete="street-address"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   <div className="space-y-2">
                     <Label>Primary Contact Name</Label>
                     <Input
                       value={companyData.primary_contact_name}
                       onChange={(e) => setCompanyData({ ...companyData, primary_contact_name: e.target.value })}
                       autoComplete="name"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Primary Contact Email</Label>
                     <Input
                       type="email"
                       value={companyData.primary_contact_email}
                       onChange={(e) => setCompanyData({ ...companyData, primary_contact_email: e.target.value })}
                       autoComplete="email"
                     />
                   </div>
                   <div className="space-y-2">
                      <Label>Primary Contact Phone</Label>
                      <Input
                        value={companyData.primary_contact_phone}
                        onChange={(e) => setCompanyData({ ...companyData, primary_contact_phone: formatPhoneNumber(e.target.value) })}
                        maxLength={14}
                        placeholder="(555) 555-5555"
                        autoComplete="tel"
                      />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   <div className="space-y-2">
                     <Label>Billing Contact Name</Label>
                     <Input
                       value={companyData.billing_contact_name}
                       onChange={(e) => setCompanyData({ ...companyData, billing_contact_name: e.target.value })}
                       autoComplete="name"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label>Billing Contact Email</Label>
                     <Input
                       type="email"
                       value={companyData.billing_contact_email}
                       onChange={(e) => setCompanyData({ ...companyData, billing_contact_email: e.target.value })}
                       autoComplete="email"
                     />
                   </div>
                   <div className="space-y-2">
                      <Label>Billing Contact Phone</Label>
                      <Input
                        value={companyData.billing_contact_phone}
                        onChange={(e) => setCompanyData({ ...companyData, billing_contact_phone: formatPhoneNumber(e.target.value) })}
                        maxLength={14}
                        placeholder="(555) 555-5555"
                        autoComplete="tel"
                      />
                   </div>
                 </div>

                 <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={companyData.notes}
                      onChange={(e) => setCompanyData({ ...companyData, notes: e.target.value })}
                    />
                 </div>
               </div>
            )}

            {/* STEP 3: User Details */}
            {currentStepView === "Personal" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">Your Personal Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label htmlFor="password">Password *</Label>
                         <button type="button" onClick={generatePassword} className="text-xs text-primary hover:underline flex items-center gap-1 font-medium bg-primary/10 px-2 py-0.5 rounded">
                           <Wand2 className="w-3 h-3" /> Suggest
                         </button>
                       </div>
                       <div className="relative">
                         <Input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           placeholder="Create a password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           autoComplete="new-password"
                         />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                       </div>
                       
                       {/* Strength indicator */}
                       {password.length > 0 && (
                         <div className="pt-1 animate-in fade-in duration-300">
                            <div className="flex gap-1 h-1.5 w-full">
                              {[1, 2, 3, 4].map((level) => (
                                <div key={level} className={`h-full flex-1 rounded-full transition-colors duration-500 ${passwordStrength >= level ? (passwordStrength < 3 ? 'bg-amber-500' : 'bg-green-500') : 'bg-muted'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-right font-medium">
                              {passwordStrength < 2 && "Weak"}
                              {passwordStrength === 2 && "Fair"}
                              {passwordStrength === 3 && "Good"}
                              {passwordStrength === 4 && "Strong!"}
                            </p>
                         </div>
                       )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAgreed}
                    onCheckedChange={(c) => setTermsAgreed(c as boolean)}
                    required 
                  />
                  <Label htmlFor="terms" className="font-normal text-sm leading-snug">
                    I agree to the{" "}
                    <button type="button" onClick={() => setShowTos(true)} className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" onClick={() => setShowPrivacy(true)} className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </button>
                  </Label>
                </div>
              </div>
            )}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6 !pt-6 bg-muted/10 rounded-b-xl">
             <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={step === 1 || loading}
             >
                Back
             </Button>
             
             {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                   Next Step
                </Button>
             ) : (
                <Button type="submit" disabled={loading} className="font-bold">
                   {loading ? "Creating account..." : "Complete Registration"}
                </Button>
             )}
          </CardFooter>
        </form>
      </Card>

      {/* Terms of Service Modal */}
      {showTos && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-3xl max-h-[85vh] rounded-xl shadow-2xl border flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden relative">
            <div className="p-6 border-b flex items-center justify-between bg-muted/10">
               <h2 className="text-2xl font-bold flex items-center gap-2">Terms of Service</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-foreground/80">
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
                 <p>By registering for an account and utilizing the Range Booking App, you and your affiliated company agree to comply strictly with these terms. You represent that you have the authority to bind your organization to these safety and operational guidelines.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">2. Facility Safety & Compliance</h3>
                 <p>Safety is our absolute priority. All users must adhere to posted range rules, follow Range Safety Officer (RSO) instructions, and utilize bays strictly within the parameters of their approved booking. Any breach of safety protocols may result in immediate expulsion and permanent account revocation.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">3. Certificate of Insurance (COI)</h3>
                 <p>External commercial entities must maintain a valid, active Certificate of Insurance (COI) on file at all times. Bookings made by companies with an expired COI may be denied or retroactively canceled by administrators without refund. It is your responsibility to upload current documentation.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">4. Bookings, Cancellations, and Billing</h3>
                 <p>All bookings are subject to administrator approval. Cancellations must occur within the specified grace period to avoid penalties. Accounts are responsible for all minimum booking fees and per-person rates incurred under their company profile.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">5. Disclaimers & Liability Waiver</h3>
                 <p>Participation in range activities carries inherent risks. To the maximum extent permitted by law, Range Booking App and the facility owners shall not be held liable for any personal injury, property damage, or loss incurred during your use of the bays.</p>
               </section>
            </div>
            <div className="p-4 border-t bg-muted/20 flex justify-end">
               <Button onClick={() => setShowTos(false)} size="lg" className="w-full sm:w-auto">Accept & Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-3xl max-h-[85vh] rounded-xl shadow-2xl border flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden relative">
            <div className="p-6 border-b flex items-center justify-between bg-muted/10">
               <h2 className="text-2xl font-bold flex items-center gap-2">Privacy Policy</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-foreground/80">
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">Data Collection</h3>
                 <p>We collect essential information required to facilitate safe and secure range bookings. This includes your name, corporate email address, contact phone, and your company\'s business details including provided Certificates of Insurance (COI).</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">How We Use Your Data</h3>
                 <p>Your data is exclusively used to: map booking requests to valid organizations, verify insurance compliance, contact you regarding schedule changes, and process billing data. We do not sell your personal or corporate data to third-party marketers.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">Internal & External Visibility</h3>
                 <p>To preserve operational privacy, "External Users" will only see their own company\'s bookings and generic un-attributed blocks of unavailability. Complete booking data is only visible to authorized internal administration staff.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">Data Security Measures</h3>
                 <p>We employ modern cryptographic standards (such as bcrypt for password hashing) and secure session policies to protect your account. Your COI files and documentation are stored in secure cloud environments restricted from public access.</p>
               </section>
               <section className="space-y-2">
                 <h3 className="text-lg font-semibold text-foreground">Audit & Retention</h3>
                 <p>To maintain historical safety records, the system logs key lifecycle events including booking modifications, user creations, and COI updates. Historical records, including expired COIs, are permanently retained for audit purposes.</p>
               </section>
            </div>
            <div className="p-4 border-t bg-muted/20 flex justify-end">
               <Button onClick={() => setShowPrivacy(false)} size="lg" className="w-full sm:w-auto">Acknowledge & Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading registration details...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
