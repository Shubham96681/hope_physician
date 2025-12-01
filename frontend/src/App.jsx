
import { Routes, Route } from "react-router-dom";
import './styles/Layout.css';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Portal from "./pages/Portal";
import Appointment from "./pages/Appointment";
import ForgotPassword from "./pages/portal/ForgotPassword";
import ResetPassword from "./pages/portal/ResetPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Employees from "./pages/admin/Employees";
import KYCReview from "./pages/admin/KYCReview";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import KYCDocuments from "./pages/patient/KYCDocuments";

// Staff Pages
import StaffDashboard from "./pages/staff/StaffDashboard";
// Import Service Pages
import FamilyMedicine from './pages/services/FamilyMedicine';
import PediatricCare from './pages/services/PediatricCare';
import MensHealth from './pages/services/MensHealth';
import WomensHealth from './pages/services/WomensHealth';
import OccupationalHealth from './pages/services/OccupationalHealth';
import GeriatricCare from './pages/services/GeriatricCare';

// Import Resource Pages
import PatientForm from './pages/resources/PatientForm';
import InsuranceInquiry from './pages/resources/InsuranceInquiry';
import PaymentPolicy from './pages/resources/PaymentPolicy';
import Insurance from './pages/resources/Insurance';
import LocalResources from './pages/resources/LocalResources';
import JobsCareers from './pages/resources/JobsCareers';
import FAQs from './pages/resources/FAQs';


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="departments" element={<Departments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="contact" element={<Contact />} />
        <Route path="portal" element={<Portal />} />
        <Route path="portal/login" element={<Portal />} />
        <Route path="portal/forgot-password" element={<ForgotPassword />} />
        <Route path="portal/reset-password" element={<ResetPassword />} />
        <Route path="appointment" element={<Appointment />} />
          
           {/* Services Routes */}
          <Route path="/family-medicine" element={<FamilyMedicine />} />
          <Route path="/pediatric-care" element={<PediatricCare />} />
          <Route path="/mens-health" element={<MensHealth />} />
          <Route path="/womens-health" element={<WomensHealth />} />
          <Route path="/occupational-health" element={<OccupationalHealth />} />
          <Route path="/geriatric-care" element={<GeriatricCare />} />
        
          {/* Resources Routes */}
          <Route path="/patient-form" element={<PatientForm />} />
          <Route path="/insurance-inquiry" element={<InsuranceInquiry />} />
          <Route path="/payment-policy" element={<PaymentPolicy />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/local-resources" element={<LocalResources />} />
          <Route path="/jobs-careers" element={<JobsCareers />} />
          <Route path="/faqs" element={<FAQs />} />
      </Route>

      {/* Protected Portal Routes */}
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/employees" element={<Employees />} />
      <Route path="/admin/patients" element={<AdminDashboard />} />
      <Route path="/admin/doctors" element={<AdminDashboard />} />
      <Route path="/admin/appointments" element={<AdminDashboard />} />
      <Route path="/admin/kyc" element={<KYCReview />} />
      <Route path="/admin/attendance" element={<AdminDashboard />} />
      <Route path="/admin/notifications" element={<AdminDashboard />} />
      <Route path="/admin/settings" element={<AdminDashboard />} />

      {/* Doctor Routes */}
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/doctor/appointments" element={<DoctorDashboard />} />
      <Route path="/doctor/patients" element={<DoctorDashboard />} />
      <Route path="/doctor/calendar" element={<DoctorDashboard />} />
      <Route path="/doctor/notifications" element={<DoctorDashboard />} />

      {/* Patient Routes */}
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/patient/appointments" element={<PatientDashboard />} />
      <Route path="/patient/book" element={<BookAppointment />} />
      <Route path="/patient/profile" element={<PatientDashboard />} />
      <Route path="/patient/kyc" element={<KYCDocuments />} />
      <Route path="/patient/notifications" element={<PatientDashboard />} />

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/staff/attendance" element={<StaffDashboard />} />
      <Route path="/staff/kyc-assist" element={<StaffDashboard />} />
      <Route path="/staff/notifications" element={<StaffDashboard />} />
    </Routes>
  );
}

export default App;
