/**
 * Billing Management
 * Create invoices, track payments, generate PDFs
 */

import { useEffect, useState } from 'react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Modal from '../../../components/shared/Modal';
import FormInput from '../../../components/shared/FormInput';
import FormSelect from '../../../components/shared/FormSelect';
import StatCard from '../../../components/shared/StatCard';
import { billingApi, patientApi } from '../../../api/staff/receptionApi';
import { FaDollarSign, FaFileInvoice, FaCheckCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useStaffStore from '../../../store/useStaffStore';

const BillingManagement = () => {
  const { billings, setBillings, billingStats, setBillingStats } = useStaffStore();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    tax: 0,
    discount: 0,
    insuranceCovered: false,
    insuranceAmount: 0
  });
  const [paymentData, setPaymentData] = useState({
    paymentStatus: 'paid',
    paidAmount: 0,
    paymentMethod: 'cash',
    paymentNotes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billingsRes, statsRes, patientsRes] = await Promise.all([
        billingApi.getAll({ page: 1, limit: 100 }),
        billingApi.getStats(),
        patientApi.getAll({ page: 1, limit: 100 })
      ]);

      setBillings(billingsRes.data.data || []);
      setBillingStats(statsRes.data.data);
      setPatients(patientsRes.data.data || []);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      tax: 0,
      discount: 0,
      insuranceCovered: false,
      insuranceAmount: 0
    });
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const total = subtotal + formData.tax - formData.discount - formData.insuranceAmount;
    return { subtotal, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subtotal, total } = calculateTotal();
    
    try {
      await billingApi.create({
        ...formData,
        subtotal,
        totalAmount: total
      });
      toast.success('Invoice created successfully!');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating invoice');
    }
  };

  const handlePayment = (billing) => {
    setSelectedBilling(billing);
    setPaymentData({
      paymentStatus: billing.paymentStatus === 'unpaid' ? 'paid' : billing.paymentStatus,
      paidAmount: billing.totalAmount - billing.paidAmount,
      paymentMethod: 'cash',
      paymentNotes: ''
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await billingApi.updatePayment(selectedBilling.id, paymentData);
      toast.success('Payment updated successfully!');
      setIsPaymentModalOpen(false);
      loadData();
    } catch (error) {
      toast.error('Error updating payment');
    }
  };

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    {
      key: 'patient',
      label: 'Patient',
      accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}`
    },
    {
      key: 'invoiceDate',
      label: 'Date',
      accessor: (row) => new Date(row.invoiceDate).toLocaleDateString()
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      accessor: (row) => `$${row.totalAmount.toFixed(2)}`
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handlePayment(row)}
            className="text-blue-600 hover:text-blue-700"
          >
            Payment
          </button>
          <button
            onClick={() => billingApi.generatePDF(row.id)}
            className="text-green-600 hover:text-green-700"
          >
            PDF
          </button>
        </div>
      )
    }
  ];

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.firstName} ${p.lastName}`
  }));

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'online', label: 'Online' }
  ];

  const { subtotal, total } = calculateTotal();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing Management</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Invoice
        </button>
      </div>

      {/* Stats */}
      {billingStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${billingStats.totalRevenue?.toLocaleString() || 0}`}
            icon={FaDollarSign}
            color="green"
          />
          <StatCard
            title="Total Invoices"
            value={billingStats.totalInvoices || 0}
            icon={FaFileInvoice}
            color="blue"
          />
          <StatCard
            title="Paid"
            value={billingStats.paidInvoices || 0}
            icon={FaCheckCircle}
            color="green"
          />
          <StatCard
            title="Pending"
            value={billingStats.unpaidInvoices || 0}
            icon={FaClock}
            color="yellow"
          />
        </div>
      )}

      {/* Billing Table */}
      <DataTable data={billings} columns={columns} loading={loading} />

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Invoice"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            label="Patient"
            name="patientId"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            options={patientOptions}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                <FormInput
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
                <FormInput
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
                <FormInput
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                />
                <div className="flex items-center">
                  <span className="text-sm">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="text-blue-600 text-sm"
            >
              + Add Item
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Tax"
              name="tax"
              type="number"
              value={formData.tax}
              onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
            />
            <FormInput
              label="Discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>${formData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>-${formData.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Update Payment"
      >
        {selectedBilling && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Invoice: {selectedBilling.invoiceNumber}</p>
              <p className="text-lg font-bold">Total: ${selectedBilling.totalAmount.toFixed(2)}</p>
              <p className="text-sm">Paid: ${selectedBilling.paidAmount.toFixed(2)}</p>
              <p className="text-sm font-semibold">
                Remaining: ${(selectedBilling.totalAmount - selectedBilling.paidAmount).toFixed(2)}
              </p>
            </div>

            <FormSelect
              label="Payment Status"
              name="paymentStatus"
              value={paymentData.paymentStatus}
              onChange={(e) => setPaymentData({ ...paymentData, paymentStatus: e.target.value })}
              options={[
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'partial', label: 'Partial' },
                { value: 'paid', label: 'Paid' }
              ]}
            />

            <FormInput
              label="Amount Paid"
              name="paidAmount"
              type="number"
              value={paymentData.paidAmount}
              onChange={(e) => setPaymentData({ ...paymentData, paidAmount: parseFloat(e.target.value) || 0 })}
              required
            />

            <FormSelect
              label="Payment Method"
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
              options={paymentMethodOptions}
            />

            <FormInput
              label="Notes"
              name="paymentNotes"
              value={paymentData.paymentNotes}
              onChange={(e) => setPaymentData({ ...paymentData, paymentNotes: e.target.value })}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Payment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BillingManagement;

