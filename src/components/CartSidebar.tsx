"use client";

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const CartSidebar = () => {
  const { t } = useTranslation();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    itemCount, 
    subtotal, 
    isCartOpen, 
    setIsCartOpen,
    clearCart
  } = useCart();
  
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsCartOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 flex items-center">
                          <FaShoppingCart className="mr-2 text-helden-purple" />
                          {t('cart.title')} ({itemCount})
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setIsCartOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">{t('cart.close')}</span>
                            <FaTimes className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        {itemCount === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10">
                            <div className="mx-auto h-24 w-24 text-gray-300">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-full w-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                              </svg>
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">{t('cart.empty')}</h3>
                            <p className="mt-1 text-sm text-gray-500">{t('cart.emptyMessage')}</p>
                            <div className="mt-6">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-helden-purple hover:bg-helden-purple-dark focus:outline-none"
                                onClick={() => setIsCartOpen(false)}
                              >
                                {t('cart.continueShopping')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {items.map((item) => (
                                <motion.li
                                  key={`${item.productId}-${item.color}-${item.size}`}
                                  className="flex py-6"
                                  layout
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={96}
                                      height={96}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <Link 
                                            href={`/${locale}/products/${item.productId}`}
                                            className="hover:text-helden-purple"
                                            onClick={() => setIsCartOpen(false)}
                                          >
                                            {item.name}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">{item.price.toFixed(2)} SAR</p>
                                      </div>
                                      <div className="mt-1 flex text-sm">
                                        {item.color && (
                                          <p className="text-gray-500">
                                            {t('cart.color')}: {item.color}
                                          </p>
                                        )}
                                        {item.size && (
                                          <p className="text-gray-500 ml-4 border-l border-gray-200 pl-4">
                                            {t('cart.size')}: {item.size}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center border rounded-md">
                                        <button
                                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.color, item.size)}
                                          className="p-1 px-2 text-gray-500 hover:text-gray-700"
                                          disabled={item.quantity <= 1}
                                        >
                                          <FaMinus className="h-3 w-3" />
                                        </button>
                                        <span className="px-2 text-gray-900">{item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                                          className="p-1 px-2 text-gray-500 hover:text-gray-700"
                                        >
                                          <FaPlus className="h-3 w-3" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-helden-purple hover:text-helden-purple-dark flex items-center"
                                          onClick={() => removeItem(item.productId, item.color, item.size)}
                                        >
                                          <FaTrash className="h-3 w-3 mr-1" />
                                          {t('cart.remove')}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                            
                            {items.length > 0 && (
                              <div className="mt-4 flex justify-end">
                                <button
                                  type="button"
                                  className="text-sm font-medium text-helden-purple hover:text-helden-purple-dark flex items-center"
                                  onClick={() => clearCart()}
                                >
                                  <FaTrash className="h-3 w-3 mr-1" />
                                  {t('cart.clearCart')}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {itemCount > 0 && (
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>{t('cart.subtotal')}</p>
                          <p>{subtotal.toFixed(2)} SAR</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">{t('cart.shippingCalculated')}</p>
                        
                        <div className="mt-6">
                          <Link
                            href={`/${locale}/checkout`}
                            className="flex items-center justify-center rounded-md border border-transparent bg-helden-purple px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-helden-purple-dark"
                            onClick={() => setIsCartOpen(false)}
                          >
                            {t('cart.checkout')}
                            <FaArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                        
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            <button
                              type="button"
                              className="font-medium text-helden-purple hover:text-helden-purple-dark"
                              onClick={() => setIsCartOpen(false)}
                            >
                              {t('cart.continueShopping')}
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartSidebar; 