package com.increff.employee.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.ApiException;



@Repository
public class BrandDao {
	 
	private static String delete_id = "delete from BrandPojo p where id=:id";
	private static String select_id = "select p from BrandPojo p where id=:id";
	private static String select_all = "select p from BrandPojo p";
	private static String selectBrandCategory = "select p from BrandPojo p where brand_name=:brand and brand_category=:category";


	
	@PersistenceContext
	private EntityManager em;

	@Transactional
	public void insert(BrandPojo p) {
		
		em.persist(p);
	}

	@Transactional
	public int delete(int id) {
		Query query = em.createQuery(delete_id);
		query.setParameter("id", id);
		return query.executeUpdate();
	}

	@Transactional
	public BrandPojo select(int id) {
		TypedQuery<BrandPojo> query = getQuery(select_id);
		query.setParameter("id", id);
		return query.getSingleResult();
	}

	@Transactional
	public List<BrandPojo> selectAll() throws ApiException {
		try
        {
        TypedQuery<BrandPojo> query = getQuery(select_all);
        return query.getResultList();
        }
        catch(NoResultException e){
//        	Log.debug("No data found");
        	throw new ApiException(e.getMessage());
        }

	}

	
	  @Transactional
	    //Retrieve brand pojo based in brand and category
	    public List<BrandPojo> selectByBrandAndCategory(String brand, String category){
	        TypedQuery<BrandPojo> query = getQuery(selectBrandCategory);
	        query.setParameter("brand",brand);
	        query.setParameter("category",category);
	        return query.getResultList();
	    }
	
	  @Transactional
	  public void update(BrandPojo p) { }
	  
	  TypedQuery<BrandPojo> getQuery(String jpql) { return em.createQuery(jpql,
	  BrandPojo.class); }
	 
	    
	
}
