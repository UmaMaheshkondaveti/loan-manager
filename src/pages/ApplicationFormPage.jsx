
    import React, { useState, useContext } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
  import useChatData from '@/hooks/useChatData';
    import { motion } from 'framer-motion';
    import { DollarSign, User, CalendarDays, Briefcase, Info, MapPin } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { UserRoleContext } from '@/App';

    const ApplicationFormPage = () => {
      const { toast } = useToast();
      const [applications, setApplications] = useLocalStorage('loanApplications', []);
      const { userRole } = useContext(UserRoleContext);
      const navigate = useNavigate();
      const [formData, setFormData] = useState({
        fullName: '',
        loanAmount: '',
        loanTenure: '',
        employmentStatus: '',
        reasonForLoan: '',
        employmentAddress: '',
        agreedToTerms: false,
        userId: userRole === 'user' ? 'currentUser' : 'adminSubmitted', 
      });
      const [errors, setErrors] = useState({});

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      };

      const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) newErrors.loanAmount = 'Valid loan amount is required.';
        if (!formData.loanTenure || parseInt(formData.loanTenure) <= 0) newErrors.loanTenure = 'Valid loan tenure is required.';
        if (!formData.employmentStatus.trim()) newErrors.employmentStatus = 'Employment status is required.';
        if (!formData.reasonForLoan.trim()) newErrors.reasonForLoan = 'Reason for loan is required.';
        if (!formData.employmentAddress.trim()) newErrors.employmentAddress = 'Employment address is required.';
        if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
          toast({
            title: 'Validation Error',
            description: 'Please fill in all required fields correctly.',
            variant: 'destructive',
          });
          return;
        }

        const newApplication = {
          id: Date.now().toString(), 
          ...formData,
          submissionDate: new Date().toISOString(),
          status: 'Pending', 
        };

        setApplications((prevApplications) => [...prevApplications, newApplication]);

        toast({
          title: 'Application Submitted!',
          description: 'Your loan application has been successfully submitted.',
          variant: 'default', 
          className: 'bg-green-500 text-white'
        });

        setFormData({
          fullName: '',
          loanAmount: '',
          loanTenure: '',
          employmentStatus: '',
          reasonForLoan: '',
          employmentAddress: '',
          agreedToTerms: false,
          userId: userRole === 'user' ? 'currentUser' : 'adminSubmitted',
        });
        setErrors({});
        
        if (userRole === 'admin') {
            navigate('/dashboard');
        } else {
            navigate('/my-loans');
        }
      };
      
      const formFields = [
        { id: "fullName", name: "fullName", label: "Full name as it appears on bank account", type: "text", placeholder: "e.g., John Doe", icon: User },
        { id: "loanAmount", name: "loanAmount", label: "How much do you need? (₦)", type: "number", placeholder: "e.g., 50000", icon: DollarSign },
        { id: "loanTenure", name: "loanTenure", label: "Loan tenure (in months)", type: "number", placeholder: "e.g., 12", icon: CalendarDays },
        { id: "employmentStatus", name: "employmentStatus", label: "Employment status", type: "text", placeholder: "e.g., Employed, Self-employed", icon: Briefcase },
        { id: "employmentAddress", name: "employmentAddress", label: "Employment Address", type: "text", placeholder: "e.g., 123 Main St, Anytown", icon: MapPin },
      ];

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-2xl overflow-hidden">
            <div className="gradient-bg p-8">
              <CardTitle className="text-3xl font-bold text-white text-center">Apply for a Loan</CardTitle>
              <CardDescription className="text-center text-primary-foreground/80 mt-2">
                Fill out the form below to apply for your loan. We're here to help you achieve your financial goals.
              </CardDescription>
            </div>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {formFields.map(field => (
                  <motion.div 
                    key={field.id} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: formFields.indexOf(field) * 0.1 }}
                  >
                    <Label htmlFor={field.id} className="flex items-center text-sm font-medium text-gray-700">
                      <field.icon className="w-4 h-4 mr-2 text-primary" />
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={errors[field.name] ? 'border-destructive ring-destructive' : ''}
                    />
                    {errors[field.name] && <p className="text-xs text-destructive">{errors[field.name]}</p>}
                  </motion.div>
                ))}
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: formFields.length * 0.1 }}
                >
                  <Label htmlFor="reasonForLoan" className="flex items-center text-sm font-medium text-gray-700">
                    <Info className="w-4 h-4 mr-2 text-primary" />
                    Reason for loan
                  </Label>
                  <Textarea
                    id="reasonForLoan"
                    name="reasonForLoan"
                    placeholder="Briefly explain why you need this loan..."
                    value={formData.reasonForLoan}
                    onChange={handleChange}
                    className={`min-h-[100px] ${errors.reasonForLoan ? 'border-destructive ring-destructive' : ''}`}
                  />
                  {errors.reasonForLoan && <p className="text-xs text-destructive">{errors.reasonForLoan}</p>}
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-2 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (formFields.length + 1) * 0.1 }}
                >
                  <Checkbox
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleChange({ target: { name: 'agreedToTerms', type: 'checkbox', checked } })}
                    className={errors.agreedToTerms ? 'border-destructive ring-destructive' : ''}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="agreedToTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read the important information and accept that by completing this application I will be bound by the terms.
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies.
                    </p>
                    {errors.agreedToTerms && <p className="text-xs text-destructive mt-1">{errors.agreedToTerms}</p>}
                  </div>
                </motion.div>

                <CardFooter className="pt-6 px-0">
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white py-3 text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105">
                    Submit Application
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ApplicationFormPage;
  