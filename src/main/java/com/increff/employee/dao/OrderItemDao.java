package com.increff.employee.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.increff.employee.pojo.OrderItemPojo;
import com.increff.employee.pojo.ProductPojo;

@Repository
public class OrderItemDao {
	
	private static String select_id = "select p from OrderItemPojo p where id=:id";
	private static String select_all = "select p from OrderItemPojo p";
	private static String select_from_orderId = "select p from OrderItemPojo p where orderId=:orderId";

	@PersistenceContext
	private EntityManager em;

	@Transactional
	public void insert(OrderItemPojo p) {
		
		em.persist(p);
	}
	
	public OrderItemPojo select(int id) {
		TypedQuery<OrderItemPojo> query = getQuery(select_id);
		query.setParameter("id", id);
		return query.getSingleResult();
	}
	

	public List<OrderItemPojo> selectAll() {
		TypedQuery<OrderItemPojo> query = getQuery(select_all);
		return query.getResultList();
	}
	
	//Get orderItems for same orderId
    public List<OrderItemPojo> selectByOrderId(int orderId){
        TypedQuery<OrderItemPojo> query = getQuery(select_from_orderId);
        query.setParameter("orderId", orderId);
        return query.getResultList();
    }
	
	
	  TypedQuery<OrderItemPojo> getQuery(String jpql) { return em.createQuery(jpql,
			  OrderItemPojo.class); }
	 

}
