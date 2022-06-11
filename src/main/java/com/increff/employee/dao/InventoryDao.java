package com.increff.employee.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.service.ApiException;

@Repository
public class InventoryDao {
	
	private static String select_id = "select p from InventoryPojo p where id=:id";
	private static String select_all = "select p from InventoryPojo p";
	private static String select="select p from InventoryPojo p where productId=:productId";

	
	@PersistenceContext
	private EntityManager em;

	@Transactional
	public void insert(InventoryPojo p) {
		
		em.persist(p);
	}
	public InventoryPojo select(int id) {
		TypedQuery<InventoryPojo> query = getQuery(select_id);
		query.setParameter("id", id);
		return query.getSingleResult();
	}

	public List<InventoryPojo> selectAll() throws ApiException {
		 try
	        {
	        	TypedQuery<InventoryPojo> query = getQuery(select_all);
	        return query.getResultList();
	        }
	        catch(NoResultException e){
//	        	Log.debug("No data found");
	        	throw new ApiException(e.getMessage());
	        }
	}

	
	//getting inventory list form product id
	 public InventoryPojo selectByProductId(int productId){
	        TypedQuery<InventoryPojo> query = getQuery(select);
	        query.setParameter("productId", productId);
	        List<InventoryPojo> res=query.getResultList();
	        if(res.size()>0){
	            return res.get(0);
	        }
	        else
	            return null;
	    }

	    //Update an inventory
	    public void update(int id,InventoryPojo inventoryPojo) {

	    }

	  
	  TypedQuery<InventoryPojo> getQuery(String jpql) { return em.createQuery(jpql,
			  InventoryPojo.class); }
	 
}
