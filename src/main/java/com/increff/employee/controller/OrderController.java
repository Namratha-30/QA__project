package com.increff.employee.controller;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.increff.employee.model.OrderData;
import com.increff.employee.model.OrderItemData;
import com.increff.employee.model.OrderItemForm;
import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.pojo.OrderItemPojo;
import com.increff.employee.pojo.OrderPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.InventoryService;
import com.increff.employee.service.OrderService;
import com.increff.employee.service.ProductService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



//Controls the order page of the application
@Api
@RestController
public class OrderController {

	 @Autowired
	    private OrderService orderService;

	    @Autowired
	    private ProductService productService;
	    
	    @Autowired
	    private InventoryService inventoryService;
	    
	    //Adds an order
	    @ApiOperation(value = "Adds Order Items")
	    @RequestMapping(path = "/api/order", method = RequestMethod.POST)
	    public void add(@RequestBody OrderItemForm[] orderItemForms) throws ApiException{
	        Map<String, ProductPojo> allProductPojoByBarcode = productService.getAllProductPojosByBarcode();
	        
	        List<OrderItemPojo> orderItemList = convertOrderItemForms(allProductPojoByBarcode, orderItemForms);
	        checkQuantityExists(orderItemList);
	        orderService.add(orderItemList);
	    }
	    
	  //Adds an OrderItem to an existing order
	    @ApiOperation(value = "Adds an OrderItem to an existing order")
	    @RequestMapping(path = "/api/order_item/{orderId}", method = RequestMethod.POST)
	    public void addOrderItem(@PathVariable int orderId, @RequestBody OrderItemForm orderItemForm) throws ApiException {
	        orderItemForm.setBarcode(orderItemForm.getBarcode().toLowerCase().trim());
	        ProductPojo productPojo = productService.getFromBarcode(orderItemForm.getBarcode());
	        OrderItemPojo orderItemPojo = convert(productPojo, orderItemForm);
	        orderService.addOrderItem(orderId, orderItemPojo);
	    }

	    //Gets a OrderItem details record by id
	    @ApiOperation(value = "Gets a OrderItem details record by id")
	    @RequestMapping(path = "/api/order_item/{id}", method = RequestMethod.GET)
	    public OrderItemData get(@PathVariable int id) throws ApiException {
	        OrderItemPojo orderItemPojo = orderService.get(id);
	        ProductPojo productPojo= productService.get(orderItemPojo.getProductId());
	        return convert(orderItemPojo,productPojo);
	    }

	    //Gets list of Order Items
	    @ApiOperation(value = "Gets list of Order Items")
	    @RequestMapping(path = "/api/order_item", method = RequestMethod.GET)
	    public List<OrderItemData> getAll() throws ApiException {
	        List<OrderItemPojo> orderItemPojoList = orderService.getAll();
	        List<OrderItemData> orderItemDataList = new ArrayList<>();
	        for (OrderItemPojo orderItemPojo : orderItemPojoList) {
	            ProductPojo productPojo= productService.get(orderItemPojo.getProductId());
	            orderItemDataList.add(convert(orderItemPojo,productPojo));
	        }
	        return orderItemDataList;
	    }

	    //Gets list of Orders
	    @ApiOperation(value = "Gets list of Orders")
	    @RequestMapping(path = "/api/order", method = RequestMethod.GET)
	    public List<OrderData> getAllOrders() {
	        List<OrderPojo> orderPojoList = orderService.getAllOrders();
	        List<OrderData> orderDataList = new ArrayList<>();
	        for (OrderPojo orderPojo : orderPojoList) {
	            orderDataList.add(convert(orderPojo));
	        }
	        return orderDataList;
	    }

	    //Get single order
	    @ApiOperation(value = "Get list of a Order")
	    @RequestMapping(path = "/api/singleOrder/{id}", method = RequestMethod.GET)
	    public OrderData getSingleOrder(@PathVariable int id) throws ApiException {
	        OrderPojo orderPojo= orderService.getOrder(id);
	        return convert(orderPojo);
	    }

	    //Gets list of Order Items of a particular order
	    @ApiOperation(value = "Gets list of Order Items of a particular order")
	    @RequestMapping(path = "/api/order/{id}", method = RequestMethod.GET)
	    public List<OrderItemData> getOrderItemsByOrderId(@PathVariable int id) throws ApiException {
	        List<OrderItemPojo> orderItemPojoList = orderService.getOrderItems(id);
	        List<OrderItemData> orderItemDataList = new ArrayList<>();
	        for (OrderItemPojo orderItemPojo : orderItemPojoList) {
	            ProductPojo productPojo= productService.get(orderItemPojo.getProductId());
	            orderItemDataList.add(convert(orderItemPojo,productPojo));
	        }
	        return orderItemDataList;
	    }

	    //Updates a OrderItem record
	    @ApiOperation(value = "Updates a OrderItem record")
	    @RequestMapping(path = "/api/order_item/{id}", method = RequestMethod.PUT)
	    public void update(@PathVariable int id, @RequestBody OrderItemForm orderItemForm) throws ApiException {
	        orderItemForm.setBarcode(orderItemForm.getBarcode().toLowerCase().trim());
	        ProductPojo productPojo = productService.getFromBarcode(orderItemForm.getBarcode());
	        OrderItemPojo orderItemPojo = convert(productPojo, orderItemForm);
	        orderService.update(id, orderItemPojo);
	    }
	    
	    private void checkQuantityExists(List<OrderItemPojo> orderItemList) throws ApiException {
			// TODO Auto-generated method stub
			List<OrderItemPojo> orderforms=new ArrayList<>();
			List<InventoryPojo> inventoryPojo=inventoryService.getAll();
			List<ProductPojo> productPojo=productService.getAll();
			HashMap<String , Integer> hMapNumbers = new HashMap<String , Integer>();
			int pid=0;
			String barcode=null;
			for(int i=0;i<orderItemList.size();i++)
			{
				for(int j=0;j<inventoryPojo.size();j++)
				{
					if(orderItemList.get(i).getProductId().equals(inventoryPojo.get(j).getProductId()))
						{
							if(orderItemList.get(i).getQuantity()>inventoryPojo.get(j).getQuantity())
							{
								pid=orderItemList.get(i).getProductId();
								for(ProductPojo productPojo1:productPojo)
								{
									if(productPojo1.getId()==pid)
									{
									barcode=productPojo1.getBarcode();
									}
								}
								hMapNumbers.put(barcode, orderItemList.get(i).getQuantity());
								orderforms.add(orderItemList.get(i));
							}
						}
				}
			}
			if(!hMapNumbers.isEmpty())
			{
				throw new ApiException("The inventory is less for the following products: "+hMapNumbers);
			}
		}
	    
	    //converts list of orderItemForms into list of OrderItemPojo
	    public static List<OrderItemPojo> convertOrderItemForms(Map<String, ProductPojo> barcodeProduct,
	                                                            OrderItemForm[] orderItemForms) throws ApiException {
	        List<OrderItemPojo> orderItemPojoList = new ArrayList<>();
	        for (OrderItemForm orderItemForm : orderItemForms) {
	            orderItemPojoList.add(convert(barcodeProduct.get(orderItemForm.getBarcode()), orderItemForm));
	        }
	        return orderItemPojoList;
	    }
	    
	    //converts orderItem form to orderItem pojo
	    public static OrderItemPojo convert(ProductPojo productPojo, OrderItemForm orderItemForm) throws ApiException {
	        OrderItemPojo orderItemPojo = new OrderItemPojo();
	        orderItemPojo.setProductId(productPojo.getId());
	        orderItemPojo.setQuantity(orderItemForm.getQuantity());
	        orderItemPojo.setSp(orderItemForm.getSp());
	        return orderItemPojo;
	    }
	    //converts order item pojo to order data
	    public static OrderItemData convert(OrderItemPojo orderItemPojo, ProductPojo productPojo) throws ApiException {
	        OrderItemData orderItemData = new OrderItemData();
	        orderItemData.setId(orderItemPojo.getId());
	        orderItemData.setBarcode(productPojo.getBarcode());
	        orderItemData.setQuantity(orderItemPojo.getQuantity());
	        orderItemData.setOrderId(orderItemPojo.getOrderId());
	        orderItemData.setSp(orderItemPojo.getSp());
	        return orderItemData;
	    }
	    
	    //Converts orderPojo to orderData
	    public static OrderData convert(OrderPojo orderPojo){
	        OrderData orderData = new OrderData();
	        orderData.setId(orderPojo.getId());
	        orderData.setDatetime(orderPojo.getDatetime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
	        orderData.setIsInvoiceGenerated(orderPojo.getIsInvoiceGenerated());
	        return orderData;
	    }


}
