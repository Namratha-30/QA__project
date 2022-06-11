package com.increff.employee.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.increff.employee.pojo.ProductPojo;

@Repository
public class ProductDao {
	
	private static String delete_id = "delete from ProductPojo p where id=:id ";
	private static String select_id = "select p from ProductPojo p where id=:id";
	private static String select_all = "select p from ProductPojo p";
    private static String select_id_barcode = "select p from ProductPojo p where barcode=:barcode";


	
	@PersistenceContext
	private EntityManager em;

	@Transactional
	public void insert(ProductPojo p) {
		
		em.persist(p);
	}

	public int delete(int id) {
		Query query = em.createQuery(delete_id);
		query.setParameter("id", id);
		return query.executeUpdate();
	}

	public ProductPojo select(int id) {
		TypedQuery<ProductPojo> query = getQuery(select_id);
		query.setParameter("id", id);
		return query.getSingleResult();
	}

	public List<ProductPojo> selectAll() {
		TypedQuery<ProductPojo> query = getQuery(select_all);
		return query.getResultList();
	}
	
	 public ProductPojo selectIdFromBarcode(String barcode){
	        TypedQuery<ProductPojo> query = getQuery(select_id_barcode);
	        query.setParameter("barcode", barcode);
	        List<ProductPojo> res=query.getResultList();
	        if(res.size()>0){ 
	            return res.get(0);
	        }
	        else
	            return null;
	    }

	
	  public void update(ProductPojo p) { }
	  
	  TypedQuery<ProductPojo> getQuery(String jpql) { return em.createQuery(jpql,
			  ProductPojo.class); }
	 
	    

}
