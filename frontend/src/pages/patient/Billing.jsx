/**
 * Patient Billing Page
 * View bills and make payments
 */

import { useEffect, useState } from 'react';
import DataTable from '../../components/shared/DataTable';
import StatusBadge from '../../components/shared/StatusBadge';
import Modal from '../../components/shared/Modal';
import { billingApi } from '../../api/patient/billingApi';
import { paymentApi } from '../../api/patient/paymentApi';
import usePatientStore from '../../store/usePatientStore';
import toast from 'react-hot-toast';
import { FaCreditCard, FaFileInvoice } from 'react-icons/fa';

const Billing = () => {
  const { bills, pendingBills, paymentHistory, setBills, setPaymentHistory } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [activeTab, setActiveTab] = useState('bills'); // 'bills' or 'history'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billsRes, historyRes] = await Promise.all([
        billingApi.getAll({ page: 1, limit: 100 }),
        billingApi.getPaymentHistory({ page: 1, limit: 100 })
      ]);

      setBills(billsRes.data.data || []);
      setPaymentHistory(historyRes.data.data || []);
    } catch (error) {
      toast.error('Error loading billing data');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (bill) => {
    setSelectedBill(bill);
    try {
      const res = await paymentApi.create({
        billingId: bill.id,
        amount: bill.totalAmount - bill.paidAmount,
        paymentMethod: 'razorpay'
      });

      // Initialize Razorpay payment
      const options = {
        key: res.data.data.key,
        amount: res.data.data.amount,
        currency: res.data.data.currency,
        name: 'Hope Physicians',
        description: `Payment for Invoice #${bill.invoiceNumber}`,
        order_id: res.data.data.orderId,
        handler: async function (response) {
          // Verify payment
          try {
            await paymentApi.verify({
              transactionId: res.data.data.transactionId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            toast.success('Payment successful!');
            setIsPaymentModalOpen(false);
            loadData();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          // Patient details
        },
        theme: {
          color: '#004aad'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error initiating payment');
    }
  };

  const billColumns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
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
      key: 'paidAmount',
      label: 'Paid',
      accessor: (row) => `$${row.paidAmount.toFixed(2)}`
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
            onClick={() => {
              setSelectedBill(row);
              setIsPaymentModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            View
          </button>
          {row.paymentStatus !== 'paid' && (
            <button
              onClick={() => handlePay(row)}
              className="text-green-600 hover:text-green-700 text-sm flex items-center space-x-1"
            >
              <FaCreditCard />
              <span>Pay</span>
            </button>
          )}
        </div>
      )
    }
  ];

  const paymentHistoryColumns = [
    {
      key: 'createdAt',
      label: 'Date',
      accessor: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: 'amount',
      label: 'Amount',
      accessor: (row) => `$${row.amount.toFixed(2)}`
    },
    { key: 'paymentMethod', label: 'Method' },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (value) => <StatusBadge status={value}>{value}</StatusBadge>
    },
    {
      key: 'billing',
      label: 'Invoice',
      accessor: (row) => row.billing?.invoiceNumber || 'N/A'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('bills')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'bills'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bills ({bills.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payment History ({paymentHistory.length})
        </button>
      </div>

      {/* Bills/Payment History Table */}
      {activeTab === 'bills' ? (
        <DataTable data={bills} columns={billColumns} loading={loading} />
      ) : (
        <DataTable data={paymentHistory} columns={paymentHistoryColumns} loading={loading} />
      )}

      {/* Bill Detail Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Invoice #${selectedBill?.invoiceNumber}`}
        size="lg"
      >
        {selectedBill && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice Date</p>
                  <p className="font-medium">
                    {new Date(selectedBill.invoiceDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">
                    {selectedBill.dueDate ? new Date(selectedBill.dueDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Qty</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedBill.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${selectedBill.subtotal.toFixed(2)}</span>
              </div>
              {selectedBill.tax > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${selectedBill.tax.toFixed(2)}</span>
                </div>
              )}
              {selectedBill.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${selectedBill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${selectedBill.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Paid:</span>
                <span>${selectedBill.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-red-600">
                <span>Balance:</span>
                <span>${(selectedBill.totalAmount - selectedBill.paidAmount).toFixed(2)}</span>
              </div>
            </div>

            {selectedBill.paymentStatus !== 'paid' && (
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => handlePay(selectedBill)}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaCreditCard />
                  <span>Pay Now</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Billing;

