package com.increff.employee.dao;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.increff.employee.pojo.OrderItemPojo;
import com.increff.employee.pojo.OrderPojo;

@Repository
public class OrderDao {
	
	private static String select_id = "select p from OrderPojo p where id=:id";
	private static String select_all = "select p from OrderPojo p";
	private static String selectByDate = "select p from OrderPojo p where datetime between :startDate and :endDate";


	@PersistenceContext
	private EntityManager em;

	@Transactional
	public int insert(OrderPojo orderPojo) {
		
		em.persist(orderPojo);
		 return orderPojo.getId();
	}
	
	@Transactional
	public OrderPojo select(int id) {
		TypedQuery<OrderPojo> query = getQuery(select_id);
		query.setParameter("id", id);
		return query.getSingleResult();
	}
	

    @Transactional
    public void update(int id,OrderPojo orderPojo){

    }
	
	@Transactional
	public List<OrderPojo> selectAll() {
		TypedQuery<OrderPojo> query = getQuery(select_all);
		return query.getResultList();
	}
	
	  @Transactional
	    public List<OrderPojo> getByDate(LocalDateTime startDate, LocalDateTime endDate){
	        TypedQuery<OrderPojo> query = getQuery(selectByDate);
	        query.setParameter("startDate",startDate);
	        query.setParameter("endDate",endDate);
	        return query.getResultList();
	    }
	
	 TypedQuery<OrderPojo> getQuery(String jpql) { return em.createQuery(jpql,
			 OrderPojo.class); }
	 

}
